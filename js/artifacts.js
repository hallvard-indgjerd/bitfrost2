let map,marker,markerGroup;
let material = [];
let collection={};
let items = [];
let matClassSet = {trigger:'getSelectOptions', list:'list_material_class', column:'en', filter:null};
let countriesSet = {trigger:'getSelectOptions', list:'countries', column:'name', filter:'id = 213 or id = 165'};
let ownerSet = {trigger:'getSelectOptions', list:'user', column:'name', filter:null};
let authorSet = {trigger:'getSelectOptions', list:'user', column:'name', filter:null};
let periodStartSet = {trigger:'getSelectOptions', list:'cultural_specific_period', column:'start', filter:null};

countItems();
getList(matClassSet,'material_class','en');
getList(countriesSet,'countries','name');
getList(authorSet,'author','name');
getList(ownerSet,'owner','name');
getList(periodStartSet,'chronoPeriodStart','definition');

$(".viewArtifactsBtn").on('click', function(){
  let item = $(this).data('item');
  localStorage.setItem('viewArtifact', item);
  window.location.href = "artifacts_view.php";
})

$("[name=addMaterial]").on('click', handleMaterial)

$("[name=chronoPeriodStart]").on('change', function(){
  $("[name=chronoPeriodEnd]").html('').attr({"disabled":false});
  let v = $(this).val()
  if (!v) {
    $("[name=chronoPeriodEnd]").attr({"disabled":true});
    return false;
  }
  let periodEndSet = {trigger:'getSelectOptions', list:'cultural_specific_period', column:'start', filter:'id >= '+v};
  let start = $(this).find("option:selected").data("start");
  let end = $(this).find("option:selected").data("end");

  getList(periodEndSet,'chronoPeriodEnd','definition');
  $("[name=chronoPeriodEnd]").attr({"disabled":false});

  $("[name=chronoYearStart],[name=chronoYearEnd]").attr({"min":start, "max":end})
  $("[name=chronoYearStart]").val(start);
  $("[name=chronoYearEnd]").val(end);
})

$("[name=chronoPeriodEnd]").on("change", function(){
  let end = $(this).find("option:selected").data("end");
  $("[name=chronoYearStart],[name=chronoYearEnd]").attr({"max":end})
  $("[name=chronoYearEnd]").val(end);
})
$("[name=chronoYearStart],[name=chronoYearEnd]").attr({"max":getData()['y']})
$("[name=chronoYearStart]").on("change", function(){
  let v = $(this).val();
  if($("[name=chronoYearEnd]").val() && $("[name=chronoYearEnd]").val() < v){$("[name=chronoYearEnd]").val(v)}
  $("[name=chronoYearEnd]").attr("min",v)
})

$("[name=countries]").on('change', function(){
  $("[name=states]").html('');
  $("[name=cities]").html('').attr({"disabled":true});
  let v = $(this).val()
  if (!v) {
    $("[name=states]").attr({"disabled":true});
    return false;
  }
  let lat = $(this).find("option:selected").data("lat");
  let lon = $(this).find("option:selected").data("lon");
  let statesSet = {trigger:'getSelectOptions', list:'states', column:'name', filter:'country_id = '+v};
  getList(statesSet,'states','name');
  $("[name=states]").attr({"disabled":false});
  setMapView([lat,lon], 4)
})

$("[name=states]").on('change', function(){
  $("[name=cities]").html('');
  let v = $(this).val()
  let lat = $(this).find("option:selected").data("lat");
  let lon = $(this).find("option:selected").data("lon");
  if (!v) {
    $("[name=cities]").attr({"disabled":true});
    return false;
  }
  let citiesSet = {trigger:'getSelectOptions', list:'cities', column:'name', filter:'state_id = '+v};
  getList(citiesSet,'cities','name');
  $("[name=cities]").attr({"disabled":false});
  setMapView([lat,lon], 8)
})

$("[name=cities]").on('change', function(){
  if (!$(this).val()) { return false; }
  let lat = $(this).find("option:selected").data("lat");
  let lon = $(this).find("option:selected").data("lon");
  setMapView([lat,lon], 14)
})

function setMapView(ll,zoom){
  $("[name=lon],[name=lat]").val('');
  map.removeLayer(markerGroup);
  map.setView(ll,zoom);
  markerGroup = L.layerGroup().addTo(map);
  marker = L.marker(ll).addTo(markerGroup);
  $("[name=lat]").val(ll[0]);
  $("[name=lon]").val(ll[1]);
}

function buildGallery(){
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data={trigger:'buildGallery'};
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(data);
    data.forEach((item, i) => {
      let div = $("<div/>",{class:'card m-1 viewArtifactsBtn'}).data("item",item.id).appendTo(".card-wrap");
      $("<div/>", {class:'card-header'})
      .css({"background-image":"url('img/model/256/"+item.name+".png')"})
      .appendTo(div);
      let body = $("<div/>",{class:'card-body'}).appendTo(div);
      $("<h3/>",{class:'card-title ms-3 txt-adc-dark fw-bold'}).text(item.name).appendTo(body);
      $("<p/>",{class:'col-10 ms-3'}).html('<span class="placeholder col-7 d-block"></span><span class="placeholder col-4 my-2 d-block"></span><span class="placeholder col-4"></span><span class="placeholder col-6"></span><span class="placeholder col-12"></span>').appendTo(body);
      $("<button/>",{class:'btn btn-primary ms-3'}).text('view').appendTo(body);
      let collectBtn = $("<button/>",{class:'btn btn-primary ms-3 addItemBtn', id: 'addItem'+item.id}).text('collect').appendTo(body);
      let uncollectBtn = $("<button/>",{class:'btn btn-danger ms-3 removeItemBtn', id: 'removeItem'+item.id}).text('remove').appendTo(body);
      uncollectBtn.hide();
      collectBtn.on('click',function(){
        items.push(item.id);
        $(this).hide();
        uncollectBtn.show();
        countItems();
      })
      uncollectBtn.on('click',function(){
        let idx = items.findIndex(i => i === item.id);
        items.splice(idx, 1);
        $(this).hide();
        collectBtn.show();
        countItems();
      })
    })
  })
}

function countItems(){$("#collectedItems").val("collected items: "+items.length)}
$("[name=material_class]").on('change', function(){
  let v = $(this).val();
  if(!v){
    $("[name=material_spec]").html('').attr({"disabled":true});
    return false;
  }
  let matSpecSet = {trigger:'getSelectOptions', list:'list_material_specs', column:'en', filter:'class = '+v}
  $("[name=material_spec]").html('');
  getList(matSpecSet,'material_spec','en');
  $("[name=material_spec]").attr({"disabled":false});
})

function getList(settings,selName,label){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data=settings;
  $.ajax(ajaxSettings)
  .done(function(data) {
    let firstOpt = $("<option/>").attr({"selected":true}).text('select a value').val('').appendTo("#"+selName)
    data.forEach((opt, i) => {
      let item = $("<option/>").val(opt.id).text(opt[label]).appendTo("#"+selName)
      if (selName=='chronoPeriodStart') {item.attr({"data-start":opt.start, "data-end":opt.end});}
      if (selName=='chronoPeriodEnd') {item.attr({"data-end":opt.end});}
      if (selName=='countries' || selName=='states' || selName=='cities') {
        let lat = parseFloat(opt.latitude).toFixed(4);
        let lon = parseFloat(opt.longitude).toFixed(4);
        item.attr({"data-lat":lat, "data-lon":lon});
      }
    });

  })
}

function handleMaterial(){
  let mclass = $("[name=material_class]").val();
  let mclassTxt = $("[name=material_class]").find("option:selected").text();
  let mspec = $("[name=material_spec]").val() ? $("[name=material_spec]").val() : null ;
  let mspecTxt = $("[name=material_spec]").val() ?  $("[name=material_spec]").find("option:selected").text() : '';
  let tech = $("[name=technique]").val() ? $("[name=technique]").val() : null;
  if (!mclass) {
    alert('You must select 1 "material class" at least');
    return false;
  }
  material.push({mclass,mspec,tech});
  let row = $("<div/>", {class:'row mb-3 border-bottom'}).appendTo("#materialWrap");
  let col1 = $("<div/>",{class:'col-md-4'}).appendTo(row);
  let col2 = $("<div/>",{class:'col-md-4'}).appendTo(row);
  let col3 = $("<div/>",{class:'col-md-3'}).appendTo(row);
  let col4 = $("<div/>",{class:'col-md-1'}).appendTo(row);
  $("<input/>",{class:'form-control-plaintext', type:'text'}).val(mclassTxt).attr({"readonly":true}).appendTo(col1);
  $("<input/>",{class:'form-control-plaintext', type:'text'}).val(mspecTxt).attr({"readonly":true}).appendTo(col2);
  $("<input/>",{class:'form-control-plaintext', type:'text'}).val(tech).attr({"readonly":true}).appendTo(col3);
  $("<button/>",{type:'button', class:'btn btn-sm btn-danger', name:'delMat'}).html('<span class="mdi mdi-trash-can"></span>').appendTo(col4).on('click', function(){
    let idx = $("#materialWrap .row").index(row);
    material.splice(idx,1)
    row.remove();
  })
  $("[name=material_class]").val($("[name=material_class] option:first").val());
  $("[name=material_spec]").html('').attr({"disabled":true});
  $("[name=technique]").val('')
}

function mapInit(){
  const mapExt = [[55.7,5.3],[69.3,30.3]];

  map = L.map('map').fitBounds(mapExt);
  let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

  markerGroup = L.layerGroup().addTo(map);
  map.on('click', function(e){
    let ll = map.mouseEventToLatLng(e.originalEvent);
    let zoom = map.getZoom();
    setMapView([parseFloat(ll.lat).toFixed(4),parseFloat(ll.lng).toFixed(4)],zoom)
  })

  $("#resetMap").on("click", function() {
    map.fitBounds(mapExt);
    map.removeLayer(markerGroup);
    $("[name=countries]").val('');
    $("[name=states], [name=cities]").html('').prop('disabled', true);
    $("[name=lat]").val('');
    $("[name=lon]").val('');
  });
}
