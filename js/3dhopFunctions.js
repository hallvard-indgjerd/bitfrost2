let presenter, scene;
const canvas = document.getElementById("draw-canvas");
const lightControllerCanvas = document.getElementById("lightcontroller_canvas");
const instanceOpt = {"nxz" : {
  mesh : "nxz",
  tags: ['Group'],
  color : [0.5, 0.5, 0.5],
  backfaceColor : [0.5, 0.5, 0.5, 3.0],
  specularColor : [0.0, 0.0, 0.0, 256.0]
}}
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

let addGrid = addBaseGrid;  //starting default
let sceneBB = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];

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
function computeEncumbrance() {
  computeSceneBB();
  var gStep = 1.0;
  // if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "mm")
  //   gStep = 10.0;
  // else if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "m")
  //   gStep = 0.01;

  var encumbrance = [0.0, 0.0, 0.0];
  encumbrance[0] = Math.trunc(Math.ceil((sceneBB[0]-sceneBB[3])/gStep)+1);
  encumbrance[1] = Math.trunc(Math.ceil((sceneBB[1]-sceneBB[4])/gStep)+1);
  encumbrance[2] = Math.trunc(Math.ceil((sceneBB[2]-sceneBB[5])/gStep)+1);

  $("#encumbrance").text("Encumbrance: "+encumbrance[0] + " x " + encumbrance[1]  + " x " + encumbrance[2] + " cm");
  // ARCHIVE.objects[OBJCODE].ENCUMBRANCE = encumbrance[0] + " x " + encumbrance[1]  + " x " + encumbrance[2] + " cm";
  // fillMetadataPanel();
}

function computeSceneBB() {
  for(inst in presenter._scene.modelInstances){
    let bb = getBBox(inst);
    if(bb[0] > sceneBB[0]) sceneBB[0] = bb[0];
    if(bb[1] > sceneBB[1]) sceneBB[1] = bb[1];
    if(bb[2] > sceneBB[2]) sceneBB[2] = bb[2];
    if(bb[3] < sceneBB[3]) sceneBB[3] = bb[3];
    if(bb[4] < sceneBB[4]) sceneBB[4] = bb[4];
    if(bb[5] < sceneBB[5]) sceneBB[5] = bb[5];
  }
}
function getBBox(instance) {
  var mname = presenter._scene.modelInstances[instance].mesh;
  var vv = presenter._scene.meshes[mname].renderable.mesh.basev;
  var bbox = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
  var point,tpoint;

  for(var vi=1; vi<(vv.length / 3); vi++){
    point = [vv[(vi*3)+0], vv[(vi*3)+1], vv[(vi*3)+2], 1.0]
    tpoint = SglMat4.mul4(presenter._scene.modelInstances[instance].transform.matrix, point);
    if(tpoint[0] > bbox[0]) bbox[0] = tpoint[0];
    if(tpoint[1] > bbox[1]) bbox[1] = tpoint[1];
    if(tpoint[2] > bbox[2]) bbox[2] = tpoint[2];
    if(tpoint[0] < bbox[3]) bbox[3] = tpoint[0];
    if(tpoint[1] < bbox[4]) bbox[4] = tpoint[1];
    if(tpoint[2] < bbox[5]) bbox[5] = tpoint[2];
  }
  return bbox;
}

/////////////////////////////////////////////////////////
//// Grid functions ////////////////////////////////////
function startupGrid(){
  for(inst in presenter._scene.modelInstances){
    let vv = presenter._scene.meshes[presenter._scene.modelInstances[inst].mesh].renderable.mesh.basev;
    if (typeof vv === 'undefined') {
      setTimeout(startupGrid, 50);
      return;
    }
  }

  computeEncumbrance();
  addGrid();
}

function addBaseGrid() {
  computeSceneBB();
  var rad = 1.0 / presenter.sceneRadiusInv;
  var XC = (sceneBB[0] + sceneBB[3]) / 2.0;
  var YC = sceneBB[4];
  var ZC = (sceneBB[2] + sceneBB[5]) / 2.0;

  var gStep = 10.0;
  var numDivMaj = Math.floor(rad/gStep);
  var linesBuffer;

  // major
  var gridBase;
  linesBuffer = [];
  for (gg = -numDivMaj; gg <= numDivMaj; gg+=1){
    linesBuffer.push([XC + (gg*gStep), YC, ZC + (-gStep*numDivMaj)]);
    linesBuffer.push([XC + (gg*gStep), YC, ZC + ( gStep*numDivMaj)]);
    linesBuffer.push([XC + (-gStep*numDivMaj), YC, ZC + (gg*gStep)]);
    linesBuffer.push([XC + ( gStep*numDivMaj), YC, ZC + (gg*gStep)]);
  }
  gridBase = presenter.createEntity("gridBase", "lines", linesBuffer);
  gridBase.color = [0.9, 0.9, 0.9, 1.0];
  gridBase.zOff = 0.0;
  presenter.repaint();
}

function changeGrid() {
  var GG = document.getElementById('i_grid').selectedIndex;
  if (GG===0)
    addGrid = removeGrid;
  if (GG===1)
    addGrid = addBaseGrid;
  if (GG===2)
    addGrid = addBoxGrid;
  if (GG===3)
    addGrid = addBBGrid;

  removeGrid();
  addGrid(0.01);
}

/////////////////////////////////////////
//// XYZ axes functions ////////////////
function removeAxes(){
  presenter.deleteEntity("XXaxis");
  presenter.deleteEntity("YYaxis");
  presenter.deleteEntity("ZZaxis");
}

function addAxes(){
  var rad = (1.0 / presenter.sceneRadiusInv)/2.0;
  var linesBuffer;
  var point, tpoint;

  point = [rad, 0.0, 0.0, 1.0]
  tpoint = SglMat4.mul4(presenter._scene.modelInstances["model_specimen_0"].transform.matrix, point);
  linesBuffer = [];
  linesBuffer.push([0, 0, 0]);
  linesBuffer.push([tpoint[0], tpoint[1], tpoint[2]]);
  var axisX = presenter.createEntity("XXaxis", "lines", linesBuffer);
  axisX.color = [1.0, 0.2, 0.2, 1.0];
  axisX.zOff = 0.0;

  point = [0.0, rad, 0.0, 1.0]
  tpoint = SglMat4.mul4(presenter._scene.modelInstances["model_specimen_0"].transform.matrix, point);
  linesBuffer = [];
  linesBuffer.push([0, 0, 0]);
  linesBuffer.push([tpoint[0], tpoint[1], tpoint[2]]);
  var axisY = presenter.createEntity("YYaxis", "lines", linesBuffer);
  axisY.color = [0.2, 1.0, 0.2, 1.0];
  axisY.zOff = 0.0;

  point = [0.0, 0.0, rad, 1.0]
  tpoint = SglMat4.mul4(presenter._scene.modelInstances["model_specimen_0"].transform.matrix, point);
  linesBuffer = [];
  linesBuffer.push([0, 0, 0]);
  linesBuffer.push([tpoint[0], tpoint[1], tpoint[2]]);
  var axisZ = presenter.createEntity("ZZaxis", "lines", linesBuffer);
  axisZ.color = [0.2, 0.2, 1.0, 1.0];
  axisZ.zOff = 0.0;

  presenter.repaint();
}
