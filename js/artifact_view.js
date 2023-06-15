ajaxSettings.url=API+"model.php";
ajaxSettings.data={trigger:'getArtifact', id:$("[name=artifactId]").val()};
$.ajax(ajaxSettings)
.done(function(data) {
  let artifact = data.artifact;
  let findplace = data.artifact_findplace;
  let material = data.artifact_material_technique;
  let measure = data.artifact_measure;
  let metadata = data.artifact_metadata;
  if (data.start_period) {}
  if (data.end_period) {}
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
});
