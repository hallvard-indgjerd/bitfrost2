const uploadButton = document.getElementById('preview');
const fileInput = document.getElementById('nxz');
const endpoint = 'api/modelPreview.php';
let file;
$("#preview, #initParamObjectForm,#progressBar").hide()
// $("#preview").hide()
$("[name=nxz]").on('change', function(){$("#preview").show()});

uploadButton.addEventListener('click', uploadFile);
function el(el){return document.getElementById(el);}

function uploadFile(){
  file = fileInput.files[0];
  var formdata = new FormData();
  formdata.append("nxz", file, file.name);
  var ajax = new XMLHttpRequest();
  $("#progressBar").show()
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
  $("#progressBar").hide()
  $("#3dhop").addClass('tdhopBg');
  el("status").innerHTML = event.target.responseText;
  el("progressBar").value = 0;
  scene = {
    meshes: {"nxz" : { url: 'archive/models/preview/'+file.name }},
    modelInstances : instanceOpt,
    // trackball: trackBallOpt,
    space: spaceOpt,
    config: configOpt
  }
  if(!presenter){
    init3dhop();
    setup3dhop(scene);
  }else {
    presenter.setScene(scene);
  }
  setupLightController();
  updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);
  setTimeout(startupGrid, 200);
  console.log(presenter);
}
function errorHandler(event){el("status").innerHTML = "Upload Failed";}
function abortHandler(event){el("status").innerHTML = "Upload Aborted";}
