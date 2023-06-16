ajaxSettings.url=API+"model.php";
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
  console.log(data);
  let statusClass = artifact.status == 'under processing' ? 'alert-danger' : 'alert-success'
  $("#status").addClass(statusClass).text("The item status is: "+artifact.status);
  $("#name").text(artifact.name);
  $("#category_class").text(artifact.category_class);
  $("#category_specs").text(artifact.category_specs);
  $("#material").html(material.material+" / "+material.technique+" <br>("+material.material_notes+")");
  $("#tipology").text(artifact.type);
  $("#description").text(artifact.description);
  $("#notes").text(artifact.notes);
  let storage_place = institution.name+ " ("+institution.abbreviation+")<br>"+institution.address+"<br><a href='"+institution.link+"' target='_blank'>link</a>";
  $("#storage_place").html(storage_place);
  $("#inventory").text(artifact.inventory);
  $("#conservation_state").text(artifact.conservation_state);
  $("#object_condition").text(artifact.object_condition);
  $("#is_a_copy").text(artifact.is_museum_copy == 0 ? 'No' : 'Yes' );
  $("#length").text(measure.length);
  $("#width").text(measure.width);
  $("#depth").text(measure.depth);
  $("#diameter").text(measure.diameter);
  $("#weight").text(measure.weight);
  $("#chronoYears").text(artifact.start + " / "+artifact.end);
  $("#start_period").text(start_period.definition);
  $("#end_period").text(end_period.definition);
  $("#auth").text(metadata.auth);
  $("#owner").text(metadata.owner);
  $("#license").html("<a href = 'https://www.google.it/search?q="+metadata.acronym+"' target='_blank'>"+metadata.license+" ("+metadata.acronym+")</a>");
  $("#create_at").text(metadata.create_at);
  $("#updated_at").text(metadata.updated_at);
});
