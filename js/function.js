const mapExt = [[55.7,5.3],[69.3,30.3]];
let collected = [];
let filter = [];
let sort = "rand()";
$("#viewCollection, #createFromFiltered").hide();

function buildGallery(){
  checkActiveFilter()
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data={trigger:'buildGallery', filter:filter, sort:sort};
  $.ajax(ajaxSettings)
  .done(function(data) {
    gallery(data,".card-wrap");
    let totItemsTxt;
    if (data.length == 0) {totItemsTxt = 'No items found';}
    if (data.length == 1) {totItemsTxt = 'Only 1 item found';}
    if (data.length > 1) {totItemsTxt = data.length+' items found';}
    $("#totItems").text(totItemsTxt);
  })
}

function countItems(){
  collected.length > 0 ? $("#viewCollection").show() : $("#viewCollection").hide()
}

function cutString(string, length) {
  let short = string.substr(0, length);
  if (/^\S/.test(string.substr(length)))
  return short.replace(/\s+\S*$/, "") + '...';
  return short;
}

function getCity(query){
  ajaxSettings.url=API+"get.php";
  // listCity.settings.filter = " (country_id = 213 or country_id = 165) and name like '%"+query+"%'"
  listCity.settings.filter = " name like '%"+query+"%'"
  ajaxSettings.data=listCity.settings;
  $.ajax(ajaxSettings)
  .done(function(data){
    citySuggested.html('')
    if(data.length == 0){
      $("<button/>", {class:'list-group-item list-group-item-action', type:'button'}).prop('disabled', true).text('No cities found').appendTo(citySuggested)
    }else {
      data.forEach((item, i) => {
        let cityBtn = $("<button/>", {class:'list-group-item list-group-item-action', type:'button'}).text(item.name+" - "+item.country_code).appendTo(citySuggested)
        cityBtn.on('click', function(){
          $("[name=city]").val(item.name).attr({"data-cityId":item.id})
          $('#citySuggested').fadeOut('fast');
          autocompleted = true;
          // setMapView([parseFloat(item.latitude),parseFloat(item.longitude)],15)
          setMapExtent(item.id)
        })
      });
    }
    citySuggested.fadeIn('fast')
  })
  .fail(function() { console.log("error");})
  .always(function() { console.log("complete"); });
}

function getDate(){
  let data = new Date();
  let d = data.getDate();
  let m = data.getMonth() + 1;
  let y = data.getFullYear();
  return {d:d, m:m, y:y}
}

function getList(settings,selName,label){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data=settings;
  $.ajax(ajaxSettings)
  .done(function(data) {
    if (selName=='city') {console.log(data)}
    data.forEach((opt, i) => {
      let item = $("<option/>").val(opt.id).text(opt[label]).appendTo("#"+selName)

      if(selName=='startGenericList' || selName=='startSpecificList' || selName=='endGenericList' || selName=='endSpecificList'){
        item.attr({"data-start":opt.start, "data-end":opt.end})
      }

      if (selName == 'author') {
        let auth = $("[name=usr]").val()
        $("#author").val(auth)
      }

      if (selName=='countries' || selName=='states' || selName=='city') {
        let lat = parseFloat(opt.latitude).toFixed(4);
        let lon = parseFloat(opt.longitude).toFixed(4);
        item.attr({"data-lat":lat, "data-lon":lon});
      }
    });
  })
}

function handleCategoryChange(){
  $("#category_specs").html('<option val="" selected>-- select a value --</option>').prop('disabled', false);
  let val = $('#category_class').val();
  getList({trigger:listTrigger, list:'list_category_specs',column:'value', filter:'category_class = '+val},'category_specs', 'value');
  let showMsgList = function(){
    $("#category_specs option").length == 1 ? $("#catSpecsMsg").fadeIn('fast') : $("#catSpecsMsg").hide();
  }
  setTimeout(showMsgList, 500)
}

function handleChronoChange(){
  let y = parseInt($("#start").val());
  if (y < -3000000 || y > getDate()['y']) {
    alert('Value not allowed. You can fill the field with values beetween -3000000 and '+getDate()['y'])
    resetChronology();
    return false;
  }
  $("#end").attr({"min":y});
}

function handleMaterialTechnique(){
  let m = parseInt($("#material").val())
  let matTxt = $("#material option:selected").text()
  let t = $("#technique").val() ? $("#technique").val() : null;
  if (!m) {
    alert("You must select a material from list at least");
    return false;
  }
  let checkM = materialTechniqueArray.some(( materialTechniqueArray ) => materialTechniqueArray.m == m);
  if (checkM) {
    alert("The value "+matTxt+" is already in the list");
    return false;
  }
  materialTechniqueArray.push({m, t});
  $("#material, #technique").val('')
  let row = $("<div/>", {class:'row wrapfield mb-3'}).appendTo("#matTechArray");
  let matDiv = $("<div/>", {class:'material'}).appendTo(row);
  let techDiv = $("<div/>", {class:'technique'}).appendTo(row);
  $("<input/>", {class:'form-control', type:'text'}).prop('readonly', true).val(matTxt).appendTo(matDiv);
  let iptGrp = $("<div/>", {class:'input-group'}).appendTo(techDiv)
  $("<input/>", {class:'form-control', type:'text'}).prop('readonly', true).val(t).appendTo(iptGrp);
  $("<button/>",{class:'btn btn-danger', type:'button', name:'delRow', title:'delete row'})
    .attr({"data-bs-toggle":'tooltip'})
    .html('<span class="mdi mdi-trash-can"></span>')
    .appendTo(iptGrp)
    .on('click', function(){
      let idx = $("#matTechArray .row").index(row);
      materialTechniqueArray.splice(idx,1)
      row.remove();
      console.log(materialTechniqueArray);
    })
    .tooltip()
}

function mapInit(){
  map = L.map('map').fitBounds(mapExt);
  osm = L.tileLayer(osmTile, { maxZoom: 18, attribution: osmAttrib}).addTo(map);
  gStreets = L.tileLayer(gStreetTile,{maxZoom: 18, subdomains:gSubDomains });
  gSat = L.tileLayer(gSatTile,{maxZoom: 18, subdomains:gSubDomains});
  gTerrain = L.tileLayer(gTerrainTile,{maxZoom: 18, subdomains:gSubDomains});
  baseLayers = {
    "OpenStreetMap": osm,
    "Google Terrain":gTerrain,
    "Google Satellite": gSat,
    "Google Street": gStreets
  };
  L.control.layers(baseLayers, null).addTo(map);

  markerGroup = L.layerGroup().addTo(map);
  map.on({
    zoomend: handleAlert,
    click:function(e){
      let zoom = map.getZoom()
      if (zoom<14) { return false;}
      let ll = map.mouseEventToLatLng(e.originalEvent);
      setMapView([parseFloat(ll.lat),parseFloat(ll.lng)],zoom)
    }
  })
  function handleAlert(){
    let alertClass, alertText;
    let zoom = map.getZoom();
    if (zoom>=14) {
      alertClass = 'alert alert-success';
      alertText = 'Ok, you can click on map to create a marker';
    }else {
      alertClass = 'alert alert-warning'
      alertText = 'To put a marker on map you have to zoom in';
    }
    $("#mapAlert").removeClass().addClass(alertClass).text(alertText)
  }

  let myToolbar = L.Control.extend({
    options: { position: 'topleft'},
    onAdd: function (map) {
      let container = L.DomUtil.create('div', 'extentControl leaflet-bar leaflet-control leaflet-touch');
      let btnHome = $("<a/>",{href:'#', title:'max zoom'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
      $("<i/>",{class:'mdi mdi-earth'}).appendTo(btnHome)
      btnHome.on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        map.fitBounds(mapExt);
      });
    return container;
    }
  })

  map.addControl(new myToolbar());
}

function resetChronology(){
  $("#start, #end, #startGenericList, #startSpecificList,#endGenericList, #endSpecificList").val('')
  $("#start, #end").attr({"min":-3000000,"max":getDate()['y']});
}
function setMapExtent(id){
  let city = L.featureGroup().addTo(map);
  let geojsonFeature = {
    "type": "Feature",
    "properties": {id:id}
  };
  ajaxSettings.url=API+"get.php";
  jsonCity.settings.filter = " id = "+id
  ajaxSettings.data=jsonCity.settings;
  $.ajax(ajaxSettings)
  .done(function(data){
    geojsonFeature.geometry = JSON.parse(data[0].geometry);
    console.log(geojsonFeature);
    let l = L.geoJson(geojsonFeature).addTo(city);
    map.fitBounds(l.getBounds());
  })
  .fail(function( jqxhr, textStatus, error ) {
    console.log("Request Failed: " + jqxhr+", "+textStatus + ", " + error );
  });
}
function setMapView(ll,zoom){
  map.removeLayer(markerGroup);
  map.setView(ll,zoom);
  markerGroup = L.layerGroup().addTo(map);
  marker = L.marker(ll).addTo(markerGroup);
  $("#latitude").val(ll[0].toFixed(4));
  $("#longitude").val(ll[1].toFixed(4));
}

$.extend({
  redirectPost: function(location, args){
    const form = $('<form></form>');
    form.attr("method", "post");
    form.attr("action", location);
    $.each( args, function( key, value ) {
      let field = $('<input></input>');
      field.attr("type", "hidden");
      field.attr("name", key);
      field.attr("value", value);
      form.append(field);
    });
    $(form).appendTo('body').submit();
  }
});
