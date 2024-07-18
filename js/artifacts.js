let map,marker,markerGroup;
let collection={};
let items = [];
let countriesSet = {trigger:'getSelectOptions', list:'countries', column:'name', filter:'id = 213 or id = 165'};
let ownerSet = {trigger:'getSelectOptions', list:'user', column:'name', filter:null};
let authorSet = {trigger:'getSelectOptions', list:'user', column:'name', filter:null};
let periodStartSet = {trigger:'getSelectOptions', list:'cultural_specific_period', column:'start', filter:null};

countItems();
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
$("[name=chronoYearStart],[name=chronoYearEnd]").attr({"max":getDate()['y']})
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

function mapInit(){
  const mapExt = [[55.7,5.3],[69.3,30.3]];

  map = L.map('map').fitBounds(mapExt);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

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
