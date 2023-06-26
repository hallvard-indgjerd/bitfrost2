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
// $("#preview").hide()
$("[name=nxz]").on('change', function(){$("#preview").show()});

uploadButton.addEventListener('click', uploadFile);
////////////////////////////
// light controller knob //
const lightControllerCanvas = document.getElementById("lightcontroller_canvas");
var VIEW_STATE = {
  "solid" : false,
  "transparency" : false,
  "lighting" : true,
  "specular" : false,
  "lightDir" : [-0.17,-0.17],
};
setupLightController();
updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);
function updateLightController(xx,yy) {
  var cwidth = lightControllerCanvas.width;
  var cheight = lightControllerCanvas.height;
  var midpoint = [Math.floor(cwidth/2.0),Math.floor(cheight/2.0)];
  var radius = Math.min(midpoint[0],midpoint[1]);

  var context = lightControllerCanvas.getContext("2d");
  context.clearRect(0, 0, cwidth, cheight);

  context.beginPath();
  context.arc(midpoint[0], midpoint[1], radius, 0, 2 * Math.PI, false);
  var grd=context.createRadialGradient(midpoint[0]+(xx*(radius-3)*2),midpoint[1]+(yy*(radius-3)*2),3,midpoint[0], midpoint[1],radius);
  grd.addColorStop(0,"yellow");
  grd.addColorStop(1,"black");
  context.fillStyle = grd;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  context.stroke();

  // presenter.ui.postDrawEvent();
  $("[name=lightx]").val(VIEW_STATE.lightDir[0]);
  $("[name=lighty]").val(VIEW_STATE.lightDir[1]);
}
function clickLightController(event) {
  var cwidth = lightControllerCanvas.width;
  var cheight = lightControllerCanvas.height;
  var midpoint = [Math.floor(cwidth/2.0),Math.floor(cheight/2.0)];
  var radius = Math.min(midpoint[0],midpoint[1]);

  var XX = event.offsetX - midpoint[0];
  var YY = event.offsetY - midpoint[1];

  // check inside circle
  if((XX*XX + YY*YY) < ((radius)*(radius))) {
    var lx = (XX / radius)/2.0;
    var ly = (YY / radius)/2.0;

    VIEW_STATE.lightDir = [lx,ly];
    // presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]); // inverted y
    updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);

    (event.touches) ? lightControllerCanvas.addEventListener("touchmove", clickLightController, false) : lightControllerCanvas.addEventListener("mousemove", clickLightController, false);
  }
}
function setupLightController() {
  // touch and click management
  // var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
  lightControllerCanvas.addEventListener("touchstart", clickLightController, false);
  lightControllerCanvas.addEventListener("mousedown", clickLightController, false);
  // var canvas = document.getElementById("draw-canvas");
  // canvas.addEventListener("mouseup", function () {
  //   lightControllerCanvas.removeEventListener("mousemove", clickLightController, false);
  //   lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
  // }, false);
  document.addEventListener("mouseup", function () {
    lightControllerCanvas.removeEventListener("mousemove", clickLightController, false);
    lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
  }, false);
}
////////////////////////////

function el(el){return document.getElementById(el);}

function uploadFile(){
  file = fileInput.files[0];
  var formdata = new FormData();
  formdata.append("nxz", file, file.name);
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
