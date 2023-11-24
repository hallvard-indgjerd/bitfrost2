const uuid = self.crypto.randomUUID();
var formdata = new FormData();
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
let listMethod = {
  settings: {trigger:listTrigger, list:'list_model_acquisition', orderBy:'value'},
  htmlEl: 'acquisition_method',
  label: 'value'
}
listArray.push(listAuthor,listOwner,listLicense,listMethod)
listArray.forEach((item, i) => {getList(item.settings,item.htmlEl,item.label)});

const uploadButton = document.getElementById('preview');
const nxz = document.getElementById('nxz');
const endpoint = 'api/modelPreview.php';
let file;

$(".closeTip").on('click', function(){
  $(this).text($(this).text()==='view tip' ? 'hide tip' : 'view tip')
})
$("#preview, #progressBar").hide()
$("[name=nxz]").on('change', function(){$("#preview").show()});
$("[name=newArtifact]").on('click', function(el){
  createFormdata(el,saveModel)
});
$("[name=checkNameBtn]").on('click', function(){
  let name = $("#name").val()
  if(!name){
    alert('The field is empty, enter a value and retry')
    return false;
  }
  if(name.length < 5){
    alert('The name must be 5 characters at least')
    return false;
  }
  checkName({name:name,element:'artifact'})
})

$("[name=saveModelParam").remove()


uploadButton.addEventListener('click', uploadFile);

function createFormdata(el, callback){
  el.preventDefault();
  formdata.append('trigger','addModel')
  const canvas = document.getElementById('draw-canvas');
  canvas.toBlob(function(blob) { formdata.append('thumb', blob, uuid+'.png'); });
  callback()
}

function saveModel(){
  $.ajax({
    type: "POST",
    enctype: 'multipart/form-data',
    url: "api/model.php",
    dataType: 'json',
    data: formdata,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 800000,
    success: function (data) {
      console.log(data);
    },
    error: function (e) {
      console.log(e);
    }
  });
}

function uploadFile(){
  file = nxz.files[0];
  formdata.append("nxz", file, uuid+".nxz");
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
  $("#progressBar").hide()
  el("status").innerHTML = event.target.responseText;
  el("progressBar").value = 0;
  $("#alertBg").remove()
  scene = {
    meshes: {"nxz" : { url: 'archive/models/preview/'+uuid+".nxz" }},
    modelInstances : instanceOpt,
    trackball: trackBallOpt,
    space: spaceOpt,
    config: configOpt
  }
  init3dhop();
  presenter = new Presenter("draw-canvas");
  presenter.setScene(scene);
  presenter._onEndMeasurement = onEndMeasure;
  presenter._onEndPickingPoint = onEndPick;
  presenter.setClippingPointXYZ(0.5, 0.5, 0.5);
  gStep = 1.0;
  startupGrid('gridBase')
}
function errorHandler(event){el("status").innerHTML = "Upload Failed";}
function abortHandler(event){el("status").innerHTML = "Upload Aborted";}
