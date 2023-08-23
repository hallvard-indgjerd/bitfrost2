const listTrigger='getSelectOptions';
let listArray = [];
let listAuthor = {
  settings: {trigger:listTrigger, list:'user', orderBy:'name'},
  htmlEl: 'author',
  label: 'name'
}
let listOwner = {
  settings: {trigger:listTrigger, list:'institution', orderBy:'name'},
  htmlEl: 'owner',
  label: 'value'
}
let listLicense = {
  settings: {trigger:listTrigger, list:'license', orderBy:'name'},
  htmlEl: 'license',
  label: 'name'
}
listArray.push(listAuthor,listOwner,listLicense)
listArray.forEach((item, i) => {getList(item.settings,item.htmlEl,item.label)});

const uploadButton = document.getElementById('preview');
const fileInput = document.getElementById('nxz');
const endpoint = 'api/modelPreview.php';
let file;
$("#preview, #initParamObjectForm,#progressBar").hide()
$("[name=nxz]").on('change', function(){$("#preview").show()});
$("[name=ortho]").on('change',updateOrtho)
$("[name=view]").on('change', function(){ viewFrom($(this).val()) })
$("[name=specular]").on('change', updateSpecular)
$("[name=lighting]").on('change', updateLighting)
$("[name=texture]").on('change', updateTexture)
$("[name=solid]").on('change', updateTransparency)
$("[name=screenshot]").on('click', function(){presenter.saveScreenshot();})

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
    trackball: trackBallOpt,
    space: spaceOpt,
    config: configOpt
  }
  if(!presenter){
    init3dhop();
    setup3dhop(scene);
    updateOrtho();
    updateTexture()
    updateTransparency()
  }else {
    presenter.setScene(scene);
  }
  setupLightController();
  updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);
  setTimeout(startupGrid, 200);
  // console.log(presenter);
}
function errorHandler(event){el("status").innerHTML = "Upload Failed";}
function abortHandler(event){el("status").innerHTML = "Upload Aborted";}
