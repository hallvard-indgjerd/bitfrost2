const uuid = self.crypto.randomUUID();
// const canvas = document.getElementById('draw-canvas');
const nxz = document.getElementById('nxz');
const endpoint = 'api/modelPreview.php';
const thumbEndpoint = 'api/modelThumbUpload.php';
let file, thumb;
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

$(".closeTip").on('click', function(){
  $(this).text($(this).text()==='view tip' ? 'hide tip' : 'view tip')
})
$("#progressBar,#thumbWrap, #nxzWrap").hide()
$("[name=nxz]").on('change', uploadFile);
$("[name=thumb]").on('change', showPreview);
$("[name=newModel]").on('click', function(el){ save(el); });
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

$("[name=measure_unit").on('change', function(){
  if($(this).val()){
    $("#uploadTip").text('To prevent the file from overwriting other files with the same name, the system will assign a unique id as the name of the file')
    $("#nxzWrap").show();
    measure_unit = $(this).val()
  }
})

$("[name=saveModelParam").remove()


function save(btn){
  const form = $("[name=newModelForm]")[0];
  // if (form.checkValidity()) {
    btn.preventDefault();
    formdata.append('trigger','addModel')
    formdata.append('name',el('name').value)
    formdata.append('description',el('description').value)
    formdata.append('note',el('note').value)
    formdata.append('author',el('author').value)
    formdata.append('owner',el('owner').value)
    formdata.append('license',el('license').value)
    // formdata.append("nxz", nxz.files[0], uuid+".nxz");
    // formdata.append("thumb", el('thumb').files[0], uuid+".nxz");
    for (const pair of formdata.entries()) { console.log(`${pair[0]}: ${pair[1]}`); }
  // }
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
  let val = nxz.value.split('.').pop()
  if(val !== 'nxz'){
    el("status").innerHTML = "Sorry but you can upload only nxz files. You are trying to upload a "+val+" file type";
    return false;
  }
  var nxzUpload = new FormData();
  file = nxz.files[0];
  nxzUpload.append("nxz", file, uuid+".nxz");
  var ajax = new XMLHttpRequest();
  $("#progressBar").show()
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", endpoint);
  ajax.send(nxzUpload);
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
  $("#uploadTip").text("Before saving the model, take a screenshot of canvas and upload it as thumbnail preview for use in the gallery")
  $("#thumbWrap").show()
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
  // startupGrid('gridBase')
  startupGrid('gridBase')
  //light component
  setupLightController()
  resizeLightController()
  updateLightController(lightDir[0],lightDir[1])  
  // getThumbnail()
}
function errorHandler(event){
  el("status").innerHTML = "Upload Failed";
  console.log(event);
}
function abortHandler(event){
  el("status").innerHTML = "Upload Aborted";
  console.log(event);
}

function getThumbnail(){
  presenter._scene.config.autoSaveScreenshot = false;
  // actionsToolbar('screenshot');
  presenter.createThumb()
  setTimeout(function(){
    // thumb = presenter.screenshotData;
    // el('imgFromPresenter').src = thumb;
    presenter._scene.config.autoSaveScreenshot = true;
    // callback()
  },1000)
}

async function convertThumb(){
  const res = await fetch(thumb);
  const blob = await res.blob();
  const fd = new FormData();
  fd.append("thumb", blob, uuid+".png");
  var ajax = new XMLHttpRequest();
  ajax.addEventListener("load", completeThumb, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", thumbEndpoint);
  ajax.send(fd);
}

function completeThumb(event){
  console.log(event.target.responseText);
}