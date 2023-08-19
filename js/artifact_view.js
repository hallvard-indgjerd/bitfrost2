let map,conservationMarker, findplaceMarker;
const mapExt = [[55.7,5.3],[69.3,30.3]];

ajaxSettings.url=API+"artifact.php";
ajaxSettings.data={trigger:'getArtifact', id:$("[name=artifactId]").val()};
$.ajax(ajaxSettings)
.done(function(data) {
  let artifact = data.artifact;
  let findplace = data.artifact_findplace;
  let material = data.artifact_material_technique;
  let measure = data.artifact_measure;
  let metadata = data.artifact_metadata;
  let institution = data.storage_place;
  if (data.start_period) {start_period = data.start_period[0];}
  if (data.end_period) {end_period = data.end_period[0]}
  let model_meta = data.paradata.model_metadata;
  let model_param = data.paradata.model_param;
  console.log(data);
  //title name
  // $("#name").text(artifact.name);

  //status
  let statusClass = artifact.status == 'under processing' ? 'alert-danger' : 'alert-success'
  $("#status").addClass(statusClass).text("The item status is: "+artifact.status);

  //description
  $("#description").text(artifact.description ? artifact.description : 'no description available');

  //main data
  $("#category_class").text(artifact.category_class);
  $("#category_specs").text(artifact.category_specs);
  $("#material").html(material.material+" / "+material.technique);
  $("#tipology").text(artifact.type);
  $("#notes").text(artifact.notes);

  //Chronological definition
  $("#chronoYears").text(artifact.start + " / "+artifact.end);
  $("#start_period").text(start_period.definition);
  $("#end_period").text(end_period.definition);

  //Conservation info
  let storage_place = institution.name+ " ("+institution.abbreviation+")<br>"+institution.address+"<br><a href='"+institution.link+"' target='_blank'>link</a>";
  $("#storage_place").html(storage_place);
  $("#inventory").text(artifact.inventory);
  $("#conservation_state").text(artifact.conservation_state);
  $("#object_condition").text(artifact.object_condition);
  $("#is_a_copy").text(artifact.is_museum_copy == 0 ? 'No' : 'Yes' );

  //measures
  $("#length").text(measure.length?measure.length:'value not available');
  $("#width").text(measure.width?measure.width:'value not available');
  $("#depth").text(measure.depth?measure.depth:'value not available');
  $("#diameter").text(measure.diameter?measure.diameter:'value not available');
  $("#weight").text(measure.weight?measure.weight:'value not available');

  //artifact metadata
  $("#auth").text(metadata.auth);
  $("#owner").text(metadata.owner);
  $("#license").html("<a href = 'https://www.google.it/search?q="+metadata.acronym+"' target='_blank'>"+metadata.license+" ("+metadata.acronym+")</a>");
  $("#create_at").text(metadata.create_at);
  $("#updated_at").text(metadata.updated_at);

  //model metadata
  $("#model-auth").text(model_meta.auth);
  $("#model-owner").text(model_meta.owner);
  $("#model-license").html("<a href = 'https://www.google.it/search?q="+model_meta.acronym+"' target='_blank'>"+model_meta.license+" ("+model_meta.acronym+")</a>");
  $("#model-create_at").text(model_meta.create_at);
  $("#model-updated_at").text(model_meta.updated_at);

  //model parameters
  $("#model-acquisition_method").text(model_param.acquisition_method?model_param.acquisition_method:'value not available');
  $("#model-software").text(model_param.software?model_param.software:'value not available');
  $("#model-scans").text(model_param.scans?model_param.scans:'value not available');
  $("#model-textures").text(model_param.textures?model_param.textures:'value not available');
  $("#model-pictures").text(model_param.pictures?model_param.pictures:'value not available');
  $("#model-points").text(model_param.points?model_param.points:'value not available');
  $("#model-polygons").text(model_param.polygons?model_param.polygons:'value not available');
  $("#model-measure_unit").text(model_param.measure_unit?model_param.measure_unit:'value not available');
  $("#model-encumbrance").text(model_param.encumbrance?model_param.encumbrance:'value not available');
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

//   $("#resetMap").on("click", function() {
//     map.fitBounds(mapExt);
//     map.removeLayer(markerGroup);
//     $("[name=countries]").val('');
//     $("[name=states], [name=cities]").html('').prop('disabled', true);
//     $("[name=lat]").val('');
//     $("[name=lon]").val('');
//   });
}
