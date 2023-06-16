let presenter, scene;
const trackBallOpt = {
  type : TurnTableTrackball,
  trackOptions : {
    startPhi: 35.0,
    startTheta: 15.0,
    startDistance: 2.5,
    minMaxPhi: [-180, 180],
    minMaxTheta: [-30.0, 70.0],
    minMaxDist: [0.5, 3.0]
  }
}
const uploadButton = document.getElementById('preview');
const fileInput = document.getElementById('nxz');
const endpoint = 'api/modelPreview.php';
let file;
$("#preview, #initParamObjectForm").hide()
$("[name=nxz]").on('change', function(){$("#preview").show()});

uploadButton.addEventListener('click', uploadFile);
function el(el){return document.getElementById(el);}

function uploadFile(){
  file = fileInput.files[0];
  var formdata = new FormData();
  formdata.append("nxz", file);
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", endpoint);
  ajax.send(formdata);
}

function progressHandler(event){
  el("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
  var percent = (event.loaded / event.total) * 100;
  el("progressBar").value = Math.round(percent);
  el("status").innerHTML = Math.round(percent)+"% uploaded... please wait";
}
function completeHandler(event){
  $("#initParamObjectForm").show();
  el("status").innerHTML = event.target.responseText;
  el("progressBar").value = 0;
  scene = {
    meshes: {"nxz" : { url: 'archive/models/preview/'+file.name }},
    modelInstances : {"nxz" : { mesh : "nxz", tags: ['Group'] }},
    //trackball: trackBallOpt
  }
  if(!presenter){
    init3dhop();
    setup3dhop(scene);
  }else {
    presenter.setScene(scene);
  }
  console.log(presenter);
}
function errorHandler(event){
  el("status").innerHTML = "Upload Failed";
}
function abortHandler(event){
  el("status").innerHTML = "Upload Aborted";
}
function setup3dhop(scene){
  presenter = new Presenter("draw-canvas");
  presenter.setScene(scene);
}
