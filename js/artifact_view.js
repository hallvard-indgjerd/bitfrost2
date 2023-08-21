let map,conservationMarker, findplaceMarker;
const mapExt = [[55.7,5.3],[69.3,30.3]];

ajaxSettings.url=API+"artifact.php";
ajaxSettings.data={trigger:'getArtifact', id:$("[name=artifactId]").val()};

$.ajax(ajaxSettings)
.done(function(data) {
  console.log(data);
  let artifact = data.artifact;
  Object.keys(artifact).forEach(function(key) {
    if(!artifact[key]){artifact[key] = 'not defined'}
    if(key == 'status'){ artifact[key] = 'The item status is: '+artifact[key] }
    if(key == 'from'){ $("#start_period").text(artifact['from']['definition'])}
    if(key == 'to'){ $("#end_period").text(artifact['to']['definition'])}
    let statusClass = artifact['status_id'] == 1 ? 'alert-danger' : 'alert-success';
    $("#status").addClass(statusClass).text("The item status is: "+artifact.status);
    artifact['is_museum_copy'] = artifact['is_museum_copy'] == 0 ? false : true;
    $("#"+key).text(artifact[key])
  })

  let material = data.artifact_material_technique;
  material.forEach((item) => {
    $("<li/>", {class:'list-group-item ps-0'}).text(item.material +" / "+(item.technique ? item.technique : 'not defined') ).appendTo('#material>ol')
  });

  let institution = data.storage_place;
  let gMapLink = 'http://maps.google.com/maps?q='+institution.name.replace(/ /g,"+");
  $("#storage_name").text(institution.name)
  $("#gMapLink").attr("href",gMapLink)
  $("#storage_address").text(institution.address)
  $("#storage_link").attr("href",institution.link).text(institution.link)

  return false;

  let findplace = data.artifact_findplace;
  let measure = data.artifact_measure;
  let metadata = data.artifact_metadata;
  if (data.start_period) {start_period = data.start_period[0];}
  if (data.end_period) {end_period = data.end_period[0]}
  let model_meta = data.paradata.model_metadata;
  let model_param = data.paradata.model_param;


  if (data.paradata.model.nxz) {
    initModel(data.paradata.model.nxz,data.paradata.model_init)
  }else{
    $("<div/>",{class:'alert alert-info text-center py-5 fs-3'}).text('Model not yet available!!').appendTo("#3dhop");
  }

  mapInit()

});

function initModel(nxz, init){
  console.log([nxz,init]);
  let scene = {
    meshes: {"nxz" : { url: 'archive/models/'+nxz }},
    modelInstances : instanceOpt,
    // trackball: trackBallOpt,
    space: spaceOpt,
    config: configOpt
  }
  init3dhop();
  presenter = new Presenter("draw-canvas");
  presenter.setScene(scene);
}

function mapInit(){
  map = L.map('map').fitBounds(mapExt);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

  //markerGroup = L.layerGroup().addTo(map);
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
