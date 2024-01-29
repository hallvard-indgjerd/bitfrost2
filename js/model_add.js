const uuid = self.crypto.randomUUID();
const nxz = document.getElementById('nxz');
const thumb = document.getElementById('thumb');
const endpoint = 'api/modelPreview.php';
const thumbEndpoint = 'api/modelThumbUpload.php';
const toastToolBar = $('#toastBtn');

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
$("#wrapViewSpot").remove()
$(".closeTip").on('click', function(){
  $(this).text($(this).text()==='view tip' ? 'hide tip' : 'view tip')
})
$("#progressBar,#thumbWrap, #nxzWrap, [name=enlargeScreen]").hide()
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
  btn.preventDefault();
  let dati = new FormData();
  dati.append('trigger','saveModel');
  $("[data-table]").each(function(){
    if($(this).val()){
      dati.append($(this).attr('id'),$(this).val())
    }
  })
  $.each(buildModelParamArray(), function(key, value){dati.append(key, value);})
  dati.append("nxz", nxz.files[0], nxz.files[0].name);
  dati.append("thumb", thumb.files[0], thumb.files[0].name);
  
  ajaxSettings.url=API+'model.php';
  ajaxSettings.data = dati;
  ajaxSettings.enctype = 'multipart/form-data';
  ajaxSettings.processData= false;
  ajaxSettings.contentType= false;
  ajaxSettings.cache= false;
  ajaxSettings.timeout = 800000;
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(data);
    if (data.res==0) {
      $("#toastDivError .errorOutput").text(data.output);
      $("#toastDivError").removeClass("d-none");
    }else {
      $(".toastTitle").text(data.output)
      gotoIndex.appendTo(toastToolBar);
      gotoDashBoard.appendTo(toastToolBar);
      gotoNewItem.attr("href","model_view.php?item="+data.id).appendTo(toastToolBar);
      newRecord.appendTo(toastToolBar);
      $("#toastDivSuccess").removeClass("d-none")
    }
    $("#toastDivContent").removeClass('d-none')
  }).fail((jqXHR, errorMsg) => {console.log(jqXHR.responseText, errorMsg)});
}

function uploadFile(){
  let val = nxz.value.split('.').pop()
  if(val !== 'nxz'){
    el("status").innerHTML = "Sorry but you can upload only nxz files. You are trying to upload a "+val+" file type";
    return false;
  }
  var nxzUpload = new FormData();
  nxzUpload.append("nxz", nxz.files[0], nxz.files[0].name);
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
    meshes: {"nxz" : { url: 'archive/models/preview/'+nxz.files[0].name }},
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
  //light component
  setupLightController()
  resizeLightController()
  updateLightController(lightDir[0],lightDir[1])
  if(!el('encumbrance').value){setTimeout(computeEncumbrance,200)}
}
function errorHandler(event){
  el("status").innerHTML = "Upload Failed";
  console.log(event);
}
function abortHandler(event){
  el("status").innerHTML = "Upload Aborted";
  console.log(event);
}

// function getThumbnail(){
//   presenter._scene.config.autoSaveScreenshot = false;
//   presenter.saveScreenshot();
//   var img = document.createElement("img");
//   document.body.appendChild(img);
//   img.src = presenter.screenshotData;
// }

// async function convertThumb(){
//   const res = await fetch(thumb);
//   const blob = await res.blob();
//   const fd = new FormData();
//   fd.append("thumb", blob, uuid+".png");
//   var ajax = new XMLHttpRequest();
//   ajax.addEventListener("load", completeThumb, false);
//   ajax.addEventListener("error", errorHandler, false);
//   ajax.addEventListener("abort", abortHandler, false);
//   ajax.open("POST", thumbEndpoint);
//   ajax.send(fd);
// }

// function completeThumb(event){
//   console.log(event.target.responseText);
// }