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
  let countyVal = $("#county").val();
  let county = countyVal ? ' county = '+countyVal+' and ': ' ';
  ajaxSettings.url=API+"get.php";
  listCity.settings.filter = county+"name like '%"+query+"%'"
  ajaxSettings.data=listCity.settings;
  $.ajax(ajaxSettings)
  .done(function(data){
    citySuggested.html('')
    if(data.length == 0){
      $("<button/>", {class:'list-group-item list-group-item-action', type:'button'}).prop('disabled', true).text('No cities found').appendTo(citySuggested)
    }else {
      data.forEach((item, i) => {
        let cityBtn = $("<button/>", {class:'list-group-item list-group-item-action', type:'button'}).text(item.name).appendTo(citySuggested)
        cityBtn.on('click', function(){
          if(!countyVal){
            $("#county").val(item.county).trigger('change');
          }
          $("[name=city]").val(item.name).attr({"data-cityId":item.id})
          $('#citySuggested').fadeOut('fast');
          autocompleted = true;
          setMapExtent('jsonCity',item.id)
        })
      });
    }
    citySuggested.fadeIn('fast')
  })
  .fail(function() { console.log("error");})
  .always(function() { console.log("complete"); });
}

function getCityFromLonLat(ll){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data={trigger: 'getCityFromLonLat', point:ll};
  let checkCity = $("[name=city]").val();
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(data);
    $("#county").val(data[0].county).trigger('change');
    $("[name=city]").val(data[0].name).attr({"data-cityId":data[0].id})
    setMapExtent('jsonCity',data[0].id)
  })
  .fail(function( jqxhr, textStatus, error ) {
    console.log("Request Failed: " + jqxhr+", "+textStatus + ", " + error );
  });
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
    data.forEach((opt, i) => {
      let item = $("<option/>").val(opt.id).text(opt[label]).appendTo("#"+selName)
      if(selName=='startGenericList' || selName=='startSpecificList' || selName=='endGenericList' || selName=='endSpecificList'){
        item.attr({"data-start":opt.start, "data-end":opt.end})
      }
      if (selName == 'author') {
        let auth = $("[name=usr]").val()
        $("#author").val(auth)
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
  map = L.map('map',{maxBounds:mapExt}).fitBounds(mapExt)
  map.setMinZoom(4);
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
  countyGroup = L.featureGroup().addTo(map);
  cityGroup = L.featureGroup().addTo(map);
  map.on({
    zoomend: handleAlert,
    // moveend: console.log(map.getBounds()),
    click:function(e){
      mapClick = true;
      let zoom = map.getZoom()
      if (zoom<14) { return false;}
      let ll = map.mouseEventToLatLng(e.originalEvent);
      $("#longitude").val(ll.lng);
      $("#latitude").val(ll.lat);
      getCityFromLonLat([parseFloat(ll.lng),parseFloat(ll.lat)], zoom)
      if (marker != undefined) { map.removeLayer(marker)};
      marker = L.marker(ll).addTo(map);
      map.setView(ll,zoom)
    }
  })
  function handleAlert(){
    let alertClass, alertText;
    // console.log(map.getBounds());
    let zoom = map.getZoom();
    if (zoom>=14) {
      alertClass = 'alert alert-success';
      alertText = 'Ok, you can click on map to create a marker';
      map.removeLayer(countyGroup);
      map.removeLayer(cityGroup);
    }else {
      alertClass = 'alert alert-warning'
      alertText = 'To put a marker on map you have to zoom in';
      map.addLayer(countyGroup);
      map.addLayer(cityGroup);
    }
    $("#mapAlert").removeClass().addClass(alertClass).text(alertText)
  }

  let myToolbar = L.Control.extend({
    options: { position: 'topleft'},
    onAdd: function (map) {
      let container = L.DomUtil.create('div', 'extentControl leaflet-bar leaflet-control leaflet-touch');
      let btnHome = $("<a/>",{href:'#', title:'max zoom', id:'maxZoomBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
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

function setMapExtent(group, id){
  console.log(mapClick);
  jsonCity.settings.list = group;
  jsonCity.settings.filter = " id = "+id
  if (group == 'jsonCounty') {
    map.removeLayer(countyGroup);
    map.removeLayer(cityGroup);
    countyGroup = L.featureGroup()
  }else {
    map.removeLayer(cityGroup);
    cityGroup = L.featureGroup()
  }
  let geojsonFeature = {
    "type": "Feature",
    "properties": {id:id}
  };
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data=jsonCity.settings;
  $.ajax(ajaxSettings)
  .done(function(data){
    let json;
    geojsonFeature.geometry = JSON.parse(data[0].geometry);
    if (group == 'jsonCounty') {
      json = L.geoJson(geojsonFeature, {style:countyStyle}).addTo(countyGroup);
      if(mapClick === false){
        countyGroup.addTo(map)
        if(!$("[name=city]").val()){
          map.fitBounds(countyGroup.getBounds());
        }
      }
    }else {
      json = L.geoJson(geojsonFeature, {style:cityStyle}).addTo(cityGroup);
      if (mapClick === false) {
        cityGroup.addTo(map)
        map.fitBounds(cityGroup.getBounds());
      }
    }
    mapClick = false;
  })
  .fail(function( jqxhr, textStatus, error ) {
    console.log("Request Failed: " + jqxhr+", "+textStatus + ", " + error );
  });
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
