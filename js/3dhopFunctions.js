let presenter, scene;
const canvas = document.getElementById("draw-canvas");
const lightControllerCanvas = document.getElementById("lightcontroller_canvas");
const instanceOpt = {"nxz" : { mesh : "nxz", tags: ['Group'] }}
const trackBallOpt = {
  type : TurnTableTrackball,
  trackOptions : {
    startPhi: 15.0,
    startTheta: 15.0,
    startDistance: 2.0,
    minMaxPhi: [-180, 180],
    minMaxTheta: [-90.0, 90.0],
    minMaxDist: [0.1, 3.0]
  }
}
const spaceOpt = {
  centerMode: "scene",
  radiusMode: "scene",
  cameraNearFar: [0.01, 5.0],
}
const configOpt = {
  pickedpointColor    : [1.0, 0.0, 1.0],
  measurementColor    : [0.5, 1.0, 0.5],
  showClippingPlanes  : true,
  showClippingBorder  : true,
  clippingBorderSize  : 0.5,
  clippingBorderColor : [0.0, 1.0, 1.0]
}

////////////////////////////
// light controller knob //
let VIEW_STATE = {
  "solid" : false,
  "transparency" : false,
  "lighting" : true,
  "specular" : false,
  "lightDir" : [-0.1700,-0.1700],
};

function setup3dhop(scene){
  presenter = new Presenter("draw-canvas");
  presenter.setScene(scene);
}

function updateLightController(xx,yy) {
  let cwidth = lightControllerCanvas.width;
  let cheight = lightControllerCanvas.height;
  let midpoint = [Math.floor(cwidth/2.0),Math.floor(cheight/2.0)];
  let radius = Math.min(midpoint[0],midpoint[1]);

  let context = lightControllerCanvas.getContext("2d");
  context.clearRect(0, 0, cwidth, cheight);
  context.beginPath();
  context.arc(midpoint[0], midpoint[1], radius, 0, 2 * Math.PI, false);

  let grd = context.createRadialGradient(midpoint[0]+(xx*(radius-3)*2),midpoint[1]+(yy*(radius-3)*2),3,midpoint[0], midpoint[1],radius);
  grd.addColorStop(0,"yellow");
  grd.addColorStop(1,"black");
  context.fillStyle = grd;
  context.fill();
  context.lineWidth = 1;

  // presenter.ui.postDrawEvent();
  $("[name=lightx]").val(VIEW_STATE.lightDir[0].toFixed(4));
  $("[name=lighty]").val(VIEW_STATE.lightDir[1].toFixed(4));
}
function clickLightController(event) {
  let cwidth = lightControllerCanvas.width;
  let cheight = lightControllerCanvas.height;
  let midpoint = [Math.floor(cwidth/2.0),Math.floor(cheight/2.0)];
  let radius = Math.min(midpoint[0],midpoint[1]);

  let XX = event.offsetX - midpoint[0];
  let YY = event.offsetY - midpoint[1];

  // check inside circle
  if((XX*XX + YY*YY) < ((radius)*(radius))) {
    let lx = (XX / radius)/2.0;
    let ly = (YY / radius)/2.0;

    VIEW_STATE.lightDir = [lx,ly];
    presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]);
    updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);

    (event.touches) ? lightControllerCanvas.addEventListener("touchmove", clickLightController, false) : lightControllerCanvas.addEventListener("mousemove", clickLightController, false);
  }
}
function setupLightController() {
  lightControllerCanvas.addEventListener("touchstart", clickLightController, false);
  lightControllerCanvas.addEventListener("mousedown", clickLightController, false);
  canvas.addEventListener("mouseup", function () {
    lightControllerCanvas.removeEventListener("mousemove", clickLightController, false);
    lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
  }, false);
  document.addEventListener("mouseup", function () {
    lightControllerCanvas.removeEventListener("mousemove", clickLightController, false);
    lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
  }, false);
}
////////////////////////////
