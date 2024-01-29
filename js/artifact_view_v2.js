const artifactId = $("[name=artifactId]").val()
const activeUser = $("[name=activeUsr]").val()
const role = $("[name=role]").val()
let storagePlaceMarker, findplaceMarker;
let markerArr={}
let polyArr={}

ajaxSettings.url=API+"artifact.php";
ajaxSettings.data={trigger:'getArtifact', id:artifactId};

$("[name=enlargeScreen").on('click', function(){
  let div = ['mainFlex','viewer','metadata','map']
  div.forEach((v)=>{$("#"+v).toggleClass(v+'_small ' + v +'_large')})
  resizeCanvas()
  map.remove();
  setTimeout(function(){
    artifactMap()
  },500)
  
})

$.ajax(ajaxSettings)
.done(function(data) {
  // console.log(data);
  let artifact = data.artifact;
  let institution = data.storage_place;
  let findplace = data.artifact_findplace;
  let model = data.model;

  $("#loadingDiv").remove()
  $("#title>h2").text(artifact.name)
  Object.keys(artifact).forEach(function(key) {
    if(key == 'status'){ artifact[key] = 'The item status is: '+artifact[key] }
    let statusClass = artifact['status_id'] == 1 ? 'alert-danger' : 'alert-success';
    $("#status").addClass(statusClass).text(artifact.status);
  })

  markerArr.storage = [parseFloat(institution.lat), parseFloat(institution.lon)]

  if (findplace) {
    if(findplace.county_id){polyArr.county=findplace.county_id}
    if(findplace.city_id){polyArr.city = findplace.city_id}
    if(findplace.latitude){
      markerArr.findplace = [parseFloat(findplace.latitude), parseFloat(findplace.longitude)]
    }    
  }
  
  
  initModel(model)
  artifactMap()

});