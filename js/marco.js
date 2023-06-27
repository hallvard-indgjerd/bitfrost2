//----------------------------------------------
var OBJCODE = null;
var SESSION_ID = null;
var ARCHIVE = new Archive();
var COLLECTION = null;
var OBJECT_ANNOTATION = {
  "version" : "1.1",
  "objectID" : null,
  "notes" : "",
  "views" : {},
  "spots" : {},
  "newIndex" : 100,
};
var VIEW_STATE = {
  "solid" : false,
  "transparency" : false,
  "lighting" : true,
  "specular" : false,
  "lightDir" : [-0.17,-0.17],
};
var MESSAGECHANNEL = null;
var IS_EDITING = false;
//----------------------------------------------
//angle measurement
var angleStage = 0;
var anglePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
//----------------------------------------------

//viewer state
var VIEWERSTATE = {};
//----------------------------------------------
var presenter = null;
//----------------------------------------------

function setup3dhop() {

  var myScene = {
    meshes: {
      "sphere" : { url: "./models/sphere.ply" },
      "cube"   : { url: "./models/cube.ply" },
    },
    modelInstances: {},
    spots: {},
    trackball: {
      type: TurntablePanTrackball,
      trackOptions: {
        startPhi: 15.0,
        startTheta: 15.0,
        startDistance: 2.0,
        minMaxPhi: [-180, 180],
        minMaxTheta: [-90.0, 90.0],
        minMaxDist: [0.1, 3.0]
      }
    },
    space: {
      centerMode: "scene",
      radiusMode: "scene",
      cameraNearFar: [0.01, 5.0],
    },
    config: {
      pickedpointColor    : [1.0, 0.0, 1.0],
      measurementColor    : [0.5, 1.0, 0.5],
      showClippingPlanes  : true,
      showClippingBorder  : true,
      clippingBorderSize  : 0.5,
      clippingBorderColor : [0.0, 1.0, 1.0]
    }
  };

  if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "m")
    myScene.config.clippingBorderSize = 0.001;

  var modelFiles = getModelFile(OBJCODE);

  modelFiles.forEach((item, ind) => {
    myScene.meshes["mesh_" + ind] = {};
    myScene.meshes["mesh_" + ind].url = modelFiles[ind];

    myScene.modelInstances["model_specimen_" +ind] = {};
    myScene.modelInstances["model_specimen_" +ind].mesh = "mesh_" + ind;
    myScene.modelInstances["model_specimen_" +ind].color = [0.5, 0.5, 0.5];
    myScene.modelInstances["model_specimen_" +ind].backfaceColor = [0.5, 0.5, 0.5, 3.0];
    myScene.modelInstances["model_specimen_" +ind].specularColor = [0.0, 0.0, 0.0, 256.0];
    myScene.modelInstances["model_specimen_" +ind].tags = ["SPECIMEN"];

    let transf = ARCHIVE.data(OBJCODE,"TRANSFORM");
    if(transf){
      myScene.modelInstances["model_specimen_" +ind].transform = JSON.parse(transf);
    }
  });

//DEBUG DEBUG
//  myScene.config.screenshotBaseName = ARCHIVE.data(OBJCODE,"THUMBNAIL_ID");

  presenter.setScene(myScene);

//--MEASURE--
  presenter._onEndMeasurement = onEndMeasure;
//--MEASURE--

//--POINT PICKING--
  presenter._onEndPickingPoint = onEndPick;
//--POINT PICKING--

//--SECTIONS--
  sectiontoolInit();
//--SECTIONS--
}

function actionsToolbar(action) {
  if(action=='measure') {
    presenter.enablePickpointMode(false);
    pickpointSwitch(false);
    enableAngleMeasurement(false);
    presenter.enableMeasurementTool(true);
    measureSwitch(true);
    setInstructions("pick two points A-B on the object to measure their distance");
  }
  if(action=='measure_on') {
    presenter.enableMeasurementTool(false);
    measureSwitch(false);
    clearInstructions();
  }
  else if(action=='pick') {
    presenter.enableMeasurementTool(false);
    measureSwitch(false);
    enableAngleMeasurement(false);
    presenter.enablePickpointMode(true);
    pickpointSwitch(true);
    setInstructions("pick a point A on the object to read its coordinates");
  }
  else if(action=='pick_on') {
    presenter._onEndPickingPoint = onEndPick;
    presenter.enablePickpointMode(false);
    pickpointSwitch(false);
    clearInstructions();
  }
  else if(action=='angle') {
    presenter.enableMeasurementTool(false);
    measureSwitch(false);
    presenter.enablePickpointMode(false);
    pickpointSwitch(false);
    enableAngleMeasurement(true);
    setInstructions("pick three points A-O-B on the object to calculate the angle A&Ocirc;B");
  }
  else if(action=='angle_on') {
    enableAngleMeasurement(false);
    clearInstructions();
  }
  else if(action=='sections') {
    sectiontoolReset();
    sectiontoolSwitch(true);
  }
  else if(action=='sections_on') {
    sectiontoolReset();
    sectiontoolSwitch(false);
  }
}

//--------------------------------------------------------------------------------------------
function enableAngleMeasurement(state){
  if(state){
    jQuery('#angle').css("visibility", "hidden");
    jQuery('#angle_on').css("visibility", "visible");
    jQuery('#angle-box').fadeIn().css("display","table");
    anchorAnglePanel();
    resetAngle();
    presenter._onEndPickingPoint = onAnglePick;
    presenter.enablePickpointMode(true);
  }
  else{
    jQuery('#angle').css("visibility", "visible");
    jQuery('#angle_on').css("visibility", "hidden");
    jQuery('#angle-box').css("display","none");
    jQuery('#angle-output').html("0.0&deg;");
    presenter.deleteEntity("angleP");
    presenter.deleteEntity("angleL");
    presenter.deleteEntity("angleV");
    presenter.enablePickpointMode(false);
    presenter._onEndPickingPoint = onEndPick;
    resetAngle();
  }
}
function anchorAnglePanel(){
  if (jQuery('#angle-box')[0] && jQuery('#angle')[0])
  {
    jQuery('#angle-box').css('left', (jQuery('#angle').position().left + jQuery('#angle').width() + jQuery('#toolbar').position().left + 5));
    jQuery('#angle-box').css('top', (jQuery('#angle').position().top + jQuery('#toolbar').position().top));
  }
}
//--------------------------------------------------------------------------------------------
var addGrid = addBaseGrid;  //starting default
var sceneBB = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];

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

function computeEncumbrance() {
  computeSceneBB();
  var gStep = 1.0;
  if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "mm")
    gStep = 10.0;
  else if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "m")
    gStep = 0.01;

  var encumbrance = [0.0, 0.0, 0.0];
  encumbrance[0] = Math.trunc(Math.ceil((sceneBB[0]-sceneBB[3])/gStep)+1);
  encumbrance[1] = Math.trunc(Math.ceil((sceneBB[1]-sceneBB[4])/gStep)+1);
  encumbrance[2] = Math.trunc(Math.ceil((sceneBB[2]-sceneBB[5])/gStep)+1);

  ARCHIVE.objects[OBJCODE].ENCUMBRANCE = encumbrance[0] + " x " + encumbrance[1]  + " x " + encumbrance[2] + " cm";
  fillMetadataPanel();
}

function removeGrid() {
  // base grid
  presenter.deleteEntity("gridBase");
  // box grid
  presenter.deleteEntity("gridBox");
  // bb grid
  presenter.deleteEntity("gridBB");
}

function addBaseGrid() {
  computeSceneBB();
  var rad = 1.0 / presenter.sceneRadiusInv;
  var XC = (sceneBB[0] + sceneBB[3]) / 2.0;
  var YC = sceneBB[4];
  var ZC = (sceneBB[2] + sceneBB[5]) / 2.0;

  var gStep = 1.0;
  if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "mm")
    gStep = 10.0;
  else if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "m")
    gStep = 0.01;
  var numDivMaj = Math.floor(rad/gStep);

  var linesBuffer;

  // major
  var gridBase;
  linesBuffer = [];
  for (gg = -numDivMaj; gg <= numDivMaj; gg+=1)
  {
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

function addBoxGrid() {
  computeSceneBB();
  var Xsteps,Ysteps,Zsteps,ii;
  var XC = (sceneBB[0] + sceneBB[3]) / 2.0;
  var YC = (sceneBB[1] + sceneBB[4]) / 2.0;
  var ZC = (sceneBB[2] + sceneBB[5]) / 2.0;

  var gStep = 1.0;
  if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "mm")
    gStep = 10.0;
  else if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "m")
    gStep = 0.01;

  Xsteps = Math.trunc(Math.ceil((sceneBB[0]-sceneBB[3])/gStep)+1);
  Ysteps = Math.trunc(Math.ceil((sceneBB[1]-sceneBB[4])/gStep)+1);
  Zsteps = Math.trunc(Math.ceil((sceneBB[2]-sceneBB[5])/gStep)+1);

  var boxG = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  boxG[0] = XC + ((Xsteps/2.0) * gStep);
  boxG[1] = YC + ((Ysteps/2.0) * gStep);
  boxG[2] = ZC + ((Zsteps/2.0) * gStep);
  boxG[3] = XC - ((Xsteps/2.0) * gStep);
  boxG[4] = YC - ((Ysteps/2.0) * gStep);
  boxG[5] = ZC - ((Zsteps/2.0) * gStep);

  var gridBox;
  var linesBuffer = [];
  //--------------------X
  for (ii=0; ii<=Ysteps; ii+=1)
  {
      linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[2]]);
      linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[5]]);
      linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[2]]);
      linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[5]]);
  }
  for (ii=0; ii<=Zsteps; ii+=1)
  {
      linesBuffer.push([boxG[3], boxG[1], boxG[5]+(gStep*ii)]);
      linesBuffer.push([boxG[3], boxG[4], boxG[5]+(gStep*ii)]);
      linesBuffer.push([boxG[0], boxG[1], boxG[5]+(gStep*ii)]);
      linesBuffer.push([boxG[0], boxG[4], boxG[5]+(gStep*ii)]);
  }
  //--------------------Y
  for (ii =0; ii <= Xsteps; ii+=1)
  {
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[2]]);
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[5]]);
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[2]]);
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[5]]);
  }
  for (ii = 0; ii <= Zsteps; ii+=1)
  {
      linesBuffer.push([boxG[0], boxG[4], boxG[5]+(gStep*ii)]);
      linesBuffer.push([boxG[3], boxG[4], boxG[5]+(gStep*ii)]);
      linesBuffer.push([boxG[0], boxG[1], boxG[5]+(gStep*ii)]);
      linesBuffer.push([boxG[3], boxG[1], boxG[5]+(gStep*ii)]);
  }
  //--------------------Z
  for (ii =0; ii <= Xsteps; ii+=1)
  {
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[5]]);
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[5]]);
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[2]]);
      linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[2]]);
  }
  for (ii = 0; ii <= Ysteps; ii+=1)
  {
      linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[5]]);
      linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[5]]);
      linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[2]]);
      linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[2]]);
  }

  gridBox = presenter.createEntity("gridBox", "lines", linesBuffer);
  gridBox.color = [0.8, 0.8, 0.8, 0.5];
  gridBox.zOff = 0.0;
  gridBox.useTransparency = true;
  presenter.repaint();
}

function addBBGrid() {
  var rad = (1.0 / presenter.sceneRadiusInv) * 1.0;
  var XC = 0.0;
  var YC = 0.0;
  var ZC = 0.0;

  var gStep = 1.0;
  if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "mm")
    gStep = 10.0;
  else if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "m")
    gStep = 0.01;
  var numDiv = Math.floor(rad / gStep);
  var linesBuffer = [];
  var gridBB;

  for (gg = -numDiv; gg <= numDiv; gg+=1)
  {
      linesBuffer.push([XC + (gg*gStep), YC + (-gStep*numDiv), ZC]);
      linesBuffer.push([XC + (gg*gStep), YC + ( gStep*numDiv), ZC]);
      linesBuffer.push([XC + (-gStep*numDiv), YC + (gg*gStep), ZC]);
      linesBuffer.push([XC + ( gStep*numDiv), YC + (gg*gStep), ZC]);
  }
  gridBB = presenter.createEntity("gridBB", "lines", linesBuffer);
  gridBB.color = [0.7, 0.7, 0.7, 0.5];
  gridBB.zOff = 0.5;
  gridBB.useTransparency = true;
  presenter.repaint();
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
function removeAxes(){
  presenter.deleteEntity("XXaxis");
  presenter.deleteEntity("YYaxis");
  presenter.deleteEntity("ZZaxis");
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

//---------------------------------------------------------------------------------------
function resizeLightController(){
  var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
  var dim = Math.min(150, Math.min(lightControllerCanvas.parentElement.clientWidth,lightControllerCanvas.parentElement.clientHeight));
  lightControllerCanvas.width = dim;
  lightControllerCanvas.height = dim;
}
function clickLightController(event) {
  var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
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
    presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]); // inverted y
    updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);

    (event.touches) ? lightControllerCanvas.addEventListener("touchmove", clickLightController, false) : lightControllerCanvas.addEventListener("mousemove", clickLightController, false);
  }
}
function updateLightController(xx,yy) {
  var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
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

  presenter.ui.postDrawEvent();
}
function setupLightController() {
    // touch and click management
    var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
    lightControllerCanvas.addEventListener("touchstart", clickLightController, false);
    lightControllerCanvas.addEventListener("mousedown", clickLightController, false);
    var canvas = document.getElementById("draw-canvas");
    canvas.addEventListener("mouseup", function () {
      lightControllerCanvas.removeEventListener("mousemove", clickLightController, false);
      lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
    }, false);
    document.addEventListener("mouseup", function () {
      lightControllerCanvas.removeEventListener("mousemove", clickLightController, false);
      lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
    }, false);
}

//---------------------------------------------------------------------------------------
function setInstructions(text){
  $('#panel_instructions').html(text);
}
function clearInstructions(){
  $('#panel_instructions').html("");
}
//---------------------------------------------------------------------------------------
function onEndMeasure(measure) {
  var clampTo = (ARCHIVE.data(OBJCODE,"MEASURE_UNIT") == "m")? 3 : 2;
  $('#measure-output').html(measure.toFixed(clampTo) + ARCHIVE.data(OBJCODE,"MEASURE_UNIT"));
}
//---------------------------------------------------------------------------------------
function onEndPick(point) {
  var clampTo = (ARCHIVE.data(OBJCODE,"MEASURE_UNIT") == "m")? 3 : 2;
  //undo object transform
  var opoint = [point[0], point[1], point[2], 1.0];
  var tpoint = SglMat4.mul4(SglMat4.inverse(presenter._scene.modelInstances["model_specimen_0"].transform.matrix), opoint);
  var x = tpoint[0].toFixed(clampTo);
  var y = tpoint[1].toFixed(clampTo);
  var z = tpoint[2].toFixed(clampTo);
    $('#pickpoint-output').html("[ "+x+" , "+y+" , "+z+" ]");
}
//---------------------------------------------------------------------------------------
function onAnglePick(point) {
  if(angleStage == 3)  angleStage = 0; //reset for new measure

  anglePoints[angleStage] = [point[0],point[1],point[2]];
  angleStage++;

  displayAngle();
  if(angleStage == 3) displayAngleEnd();
}

function displayAngle(){
  var pointsBuffer = [];
  var linesBuffer = [];
  var ii = 0;

  for(ii=0; ii<angleStage; ii++){
    pointsBuffer.push(anglePoints[ii]);
  }
  for(ii=0; ii<angleStage-1; ii++){
    linesBuffer.push(anglePoints[ii]);
    linesBuffer.push(anglePoints[ii+1]);
  }

  var angleP = presenter.createEntity("angleP", "points", pointsBuffer);
  angleP.color = [0.2, 0.3, 0.9, 1.0];
  angleP.zOff = 0.001;

  var angleL = presenter.createEntity("angleL", "lines", linesBuffer);
  angleL.color = [0.2, 0.3, 0.9, 1.0];
  angleL.zOff = 0.001;

  presenter.deleteEntity("angleV");
  presenter.repaint();
}
function displayAngleEnd(){
  var v1 = SglVec3.normalize(SglVec3.sub(anglePoints[0], anglePoints[1]));
  var v2 = SglVec3.normalize(SglVec3.sub(anglePoints[2], anglePoints[1]));
  var angle = sglRadToDeg(Math.acos(SglVec3.dot(v1,v2)));
  $('#angle-output').html(angle.toFixed(2) + "&deg;");

  var len = 0.75 * Math.min(SglVec3.length(SglVec3.sub(anglePoints[0], anglePoints[1])), SglVec3.length(SglVec3.sub(anglePoints[2], anglePoints[1])));

  var triBuffer = [];
  triBuffer.push(anglePoints[1]);
  triBuffer.push(SglVec3.add(SglVec3.muls(v1,len),anglePoints[1]));
  triBuffer.push(SglVec3.add(SglVec3.muls(v2,len),anglePoints[1]));
  var angleV = presenter.createEntity("angleV", "triangles", triBuffer);
  angleV.color = [0.2, 0.5, 0.7, 0.3];
  angleV.zOff = 0.01;
  angleV.useTransparency = true;
}

function resetAngle(){
  angleStage = 0;
  anglePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
}
//---------------------------------------------------------------------------------------
function toolsReset(){
  presenter.enablePickpointMode(false);
  pickpointSwitch();
  presenter.enableMeasurementTool(false);
  measureSwitch();
  jQuery('#angle').css("visibility", "visible");
  jQuery('#angle_on').css("visibility", "hidden");
  jQuery('#angle-box').css("display","none");
  jQuery('#angle-output').html("0.0 °");
  presenter.deleteEntity("angleP");
  presenter.deleteEntity("angleL");
  presenter.deleteEntity("angleV");
  sectiontoolReset();
  sectiontoolSwitch(false);
  clearInstructions();
}
//---------------------------------------------------------------------------------------
function resetViewState(field, value){
  VIEW_STATE["solid"] = false;
  VIEW_STATE["transparency"] = false;
  VIEW_STATE["lighting"] = true;
  VIEW_STATE["specular"] = false;
  VIEW_STATE["lightDir"] = [-0.17,-0.17];
  displayViewState();
}
function updateViewState(field, value){
  VIEW_STATE[field] = value;
  displayViewState();
}

function displayViewState(){
  $('#i_solidColor').bootstrapToggle((VIEW_STATE.solid)?'on':'off', true);
  presenter.setInstanceSolidColor('SPECIMEN', VIEW_STATE.solid, false);

  $('#i_transparency').bootstrapToggle((VIEW_STATE.transparency)?'on':'off', true);
  presenter.setInstanceTransparency('SPECIMEN', VIEW_STATE.transparency, false);

  $('#i_useLighting').bootstrapToggle((VIEW_STATE.lighting)?'on':'off', true);
  presenter.enableSceneLighting(VIEW_STATE.lighting);

  $('#i_useSpecular').bootstrapToggle((VIEW_STATE.specular)?'on':'off', true);
  var newSpecular;
  if(VIEW_STATE.specular)
    newSpecular = [0.3,0.3,0.3,256.0];
  else
    newSpecular = [0.0,0.0,0.0,256.0];
  for (inst in presenter._scene.modelInstances){
    presenter._scene.modelInstances[inst].specularColor = newSpecular;
  }

  presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]); // inverted y
  updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);

  presenter.repaint();
}

function updateOrtho(value){
  if(value){
    presenter.setCameraOrthographic();
    $('#i_orthoCamera')[0].checked = true;
  }
  else {
    presenter.setCameraPerspective();
    $('#i_orthoCamera')[0].checked = false;
  }
}

//---------------------------------------------------------------------------------------
function showHelp(){
  $('#helpPanel').modal("show");
}
//---------------------------------------------------------------------------------------
function home(){
  presenter.resetTrackball();
  // put back light
  presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]); // inverted y
  updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);
}
//---------------------------------------------------------------------------------------
function viewFrom(direction){
  var distance = 1.3;
    switch(direction) {
        case "front":
      presenter.animateToTrackballPosition([0.0, 0.0, 0.0, 0.0, 0.0, distance]);
            break;
        case "back":
      presenter.animateToTrackballPosition([180.0, 0.0, 0.0, 0.0, 0.0, distance]);
            break;
        case "top":
      presenter.animateToTrackballPosition([0.0, 90.0, 0.0, 0.0, 0.0, distance]);
            break;
        case "bottom":
      presenter.animateToTrackballPosition([0.0, -90.0, 0.0, 0.0, 0.0, distance]);
            break;
        case "left":
      presenter.animateToTrackballPosition([270.0, 0.0, 0.0, 0.0, 0.0, distance]);
            break;
        case "right":
      presenter.animateToTrackballPosition([90.0, 0.0, 0.0, 0.0, 0.0, distance]);
            break;
    }
}
//---------------------------------------------------------------------------------------
function onTrackballUpdate(trackState){
  updateCube(-trackState[0], -trackState[1]);
  updateGrid(trackState);
}
function updateCube(angle, tilt) {
    var transf = "translateZ(-100px) rotateX("+tilt+"deg) rotateY("+angle+"deg)";
    $('.cube').css({"transform":transf});
}
function updateGrid(trackState){
  if (typeof presenter._scene.entities === 'undefined') return;
  if (typeof presenter._scene.entities["gridBB"] === 'undefined') return;

  var tt=[0.0,0.0,0.0];
  tt[0] = (trackState[2] / presenter.sceneRadiusInv) + presenter.sceneCenter[0];
  tt[1] = (trackState[3] / presenter.sceneRadiusInv) + presenter.sceneCenter[1];
  tt[2] = (trackState[4] / presenter.sceneRadiusInv) + presenter.sceneCenter[2];

  var mrX = SglMat4.rotationAngleAxis(sglDegToRad(-trackState[1]), [1.0, 0.0, 0.0]);
  var mrY = SglMat4.rotationAngleAxis(sglDegToRad(trackState[0]), [0.0, 1.0, 0.0]);
  var mrT = SglMat4.translation(tt);
  var matrix = SglMat4.mul(SglMat4.mul(mrT, mrY), mrX);
  presenter._scene.entities["gridBB"].transform.matrix = matrix;
}
//---------------------------------------------------------------------------------------
function fillMetadataPanel(){
  var target = document.getElementById("panel_info");
  target.innerHTML = "";
  var content = "";

  content +=  `
    <div class='col p-1 m-0 align-items-left w-100'>
      <h5 style='font-size:min(2vw,1.5em);'>METADATA<\/h5>
      <h6>
      <table border=1 style='width:100%;font-size:min(1.2vw,1rem);'>
  `;

  for(const field of META){
    var fname = NAMING[field][LANGUAGE];
    var fval = ARCHIVE.data(OBJCODE,field);
    if(fval)
      content += `<tr><td>${fname}<\/td><td> ${fval} <\/td><\/tr>`;
  }

  content += `
      <\/table>
      <\/h6>
      <h5 style='font-size:min(2vw,1.5em);'>PARADATA<\/h5>
      <h6>
      <table border=1 style='width:100%;font-size:min(1.2vw,1rem);'>
  `;

  for(const field of PARA){
    var fname = NAMING[field][LANGUAGE];
    var fval = ARCHIVE.data(OBJCODE,field);
    if(fval)
      content += `<tr><td>${fname}<\/td><td> ${fval} <\/td><\/tr>`;
  }

  content += `
      <\/table>
      <\/h6>
  <\/div>`;

  target.innerHTML = content;
}

function fillNotesPanel(){
  var target = document.getElementById("panel_notes");
  target.innerHTML = "";
  var content = "";

  content += "<div class='col p-1 m-0 align-items-left w-100'>\n";
  content += "  <h6>\n";
  content += "  <div class='form-group'>";
  content += "  <textarea class='form-control resp_font' id='i_objectNotes' rows='12' style='resize:none;' onchange='updateObjectNotes();'></textarea>";
  content += "  </div>";
  content += "  </h6>\n";
  content += "</div>\n";

  target.innerHTML = content;

  document.getElementById("i_objectNotes").value = OBJECT_ANNOTATION.notes;
}

function fillViewsPanel(){
  $(".tooltip").tooltip("hide");
  var target = document.getElementById("panel_views");
  target.innerHTML = "";
  var content = "";

  content += `
  <div class="col p-1 m-0 align-items-left w-100">
  <table class="mt-2" border="1" style="width:100%;font-size:min(1.2vw,1rem);">
  <thead><tr><th style="text-align:center">GO<\/th><th><center>Description<\/center><\/th><th> <\/th><\/thead>
  `;

  for (const view in OBJECT_ANNOTATION.views){
    content += `
    <tr>
    <td style="text-align:center">
      <button data-toggle="tooltip" data-placement="top" title='Go to View' class='m-1 btn-sm btn-secondary' onclick='gotoView("${view}")'><img src='./media/view.png' width='15px'/><\/button>
    <\/td>
    <td><textarea class='form-control resp_font' id='i_viewText_${view}' rows='3' style='resize:none;' onchange='updateViewText("${view}",this.value);'>${OBJECT_ANNOTATION.views[view].text}<\/textarea><\/td>
    <td style="text-align:center">
      <button data-toggle="tooltip" data-placement="top" title='Update View' class='m-1 btn-sm btn-secondary' onclick='if(confirm(\"Update View?\")) updateView("${view}");'><img src='./media/edit.png' width='15px'/><\/button><\/br>
      <button data-toggle="tooltip" data-placement="bottom" title='Delete View' class='m-1 btn-sm btn-danger' onclick='if(confirm(\"Delete View?\")) deleteView("${view}");'><img src='./media/delete.png' width='15px'/><\/button>
    <\/td>
    <\/tr>
    `;
  }

  content += `
    <tr><td colspan="3"><button class="ml-3 my-1 btn btn-secondary btn-small" onclick="addView();" data-toggle="tooltip" data-placement="bottom" title="Add New View"><img src='./media/add.png' width='25px'/><\/button><\/td><\/tr>
  <\/table>
  <\/div>
  `;

  target.innerHTML = content;
  $('[data-toggle="tooltip"]').tooltip({trigger : 'hover'});
}

function fillSpotsPanel(){
  $(".tooltip").tooltip("hide");
  var target = document.getElementById("panel_spots");
  target.innerHTML = "";
  var content = "";

  content += `
  <div class="col p-1 m-0 align-items-left w-100">
  <table class="mt-2" border="1" style="width:100%;font-size:min(1.2vw,1rem);">
  <thead><tr>
  <th style="text-align:center"><div><img src='./media/eye.png' width='20px' onclick='updateAllSpotsVis(true);'/><img src='./media/eye_off.png' width='20px' onclick='updateAllSpotsVis(false);'/><\/div><\/th>
  <th style="text-align:center">Description<\/th>
  <th> <\/th>
  <th> <\/th>
  <\/tr><\/thead>
  `;

  for (const spot in OBJECT_ANNOTATION.spots){

    // get hex color
    let r = parseInt(OBJECT_ANNOTATION.spots[spot].color[0]*255);
    let g = parseInt(OBJECT_ANNOTATION.spots[spot].color[1]*255);
    let b = parseInt(OBJECT_ANNOTATION.spots[spot].color[2]*255);
    var hxcol = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

    content += `
    <tr>
    <td style="text-align:center">
    <input type='checkbox' id='i_spotVis_${spot}' ${OBJECT_ANNOTATION.spots[spot].visible?'checked':''} onclick='updateSpotVis("${spot}",this.checked);' title='Visible'><\/i>
    <\/td>
    <td><textarea class='form-control resp_font' id='i_spotText_${spot}' rows='2' style='resize:none;' onchange='updateSpotText("${spot}",this.value);'>${OBJECT_ANNOTATION.spots[spot].text}<\/textarea><\/td>
    <td style="text-align:center">
      <input type='number' min='1' max='10' value='${OBJECT_ANNOTATION.spots[spot].radius}' onchange='updateSpotRadius("${spot}",this.value);' style='width:2em;' title='Radius'><\/br>
      <input type='color' id='i_spotColor_${spot}' value='${hxcol}' onchange='updateSpotColor("${spot}",this.value);' title='Color'>
    <\/td>
    <td style="text-align:center">
      <button title='Delete Spot' class='m-1 btn-sm btn-danger' onclick='if(confirm(\"Delete Spot?\")) deleteSpot("${spot}");'><img src='./media/delete.png' width='15px'/><\/button>
    <\/td>
    <\/tr>
    `;
  }

  content += `
    <tr><td colspan="4"><button class="ml-3 my-1 btn btn-secondary btn-small" onclick="addSpot();" data-toggle="tooltip" data-placement="bottom" title="Add New Spot"><img src='./media/add.png' width='25px'/><\/button><\/td><\/tr>
  <\/table>
  <\/div>
  `;

  target.innerHTML = content;
  $('[data-toggle="tooltip"]').tooltip({trigger : 'hover'});
}

function fillScenePanel(){
  $(".tooltip").tooltip("hide");
  var models = ARCHIVE.data(OBJCODE,"3D_OBJECT_ID");

  if(models.constructor != Array)  //just single model, skip this
  return;

  //show scene tab
  document.querySelector("#scene-tab-li").style.display = "block"

  var target = document.getElementById("panel_scene");
  target.innerHTML = "";
  var content = "";

  content += "<div class='col p-1 m-0 align-items-left w-100'>";
  content += "<h5 class='mb-3' style='font-size:min(1.5vw, 1.5rem);'>Components:</h5>";

  models.forEach((item, ind) => {
    var instName = "model_specimen_" +ind;
    content += `
    <h6 style='font-size:min(1.5vw, 1rem);'><b>${ind}<\/b> <input id="" class="mx-2" type="checkbox" checked style="transform:translateY(min(0.3vw, 0.3rem)); width:min(1.5vw, 1rem); height:min(1.5vw, 1.5rem); cursor:hand;" onclick="presenter.toggleInstanceVisibilityByName('${instName}',true);"> ${item} <\/h6>
    `;

  /*
    myScene.meshes["mesh_" + ind] = {};
    myScene.meshes["mesh_" + ind].url = modelFile[ind];

    myScene.modelInstances["model_specimen_" +ind] = {};
    myScene.modelInstances["model_specimen_" +ind].mesh = "mesh_" + ind;
    myScene.modelInstances["model_specimen_" +ind].color = [0.5, 0.5, 0.5];
    myScene.modelInstances["model_specimen_" +ind].backfaceColor = [0.5, 0.5, 0.5, 3.0];
    myScene.modelInstances["model_specimen_" +ind].specularColor = [0.0, 0.0, 0.0, 256.0];
    myScene.modelInstances["model_specimen_" +ind].tags = ["SPECIMEN"];

    let transf = ARCHIVE.data(OBJCODE,"TRANSFORM");
    if(transf){
      myScene.modelInstances["model_specimen_" +ind].transform = JSON.parse(transf);
    }
  */
  });

  content += "<\/div>";

  target.innerHTML = content;
  $('[data-toggle="tooltip"]').tooltip({trigger : 'hover'});
}



//---------------------------------------------------------------------------------------



function updateObjectNotes(){
  OBJECT_ANNOTATION.notes = document.getElementById("i_objectNotes").value;
}

function saveAnnotations(){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(OBJECT_ANNOTATION, null, 2)));
  element.setAttribute('download', "annotation.json");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  toastr.success('Annotations Exported');
}

function loadAnnotations(){
  document.getElementById("i_JSON").click();
}
function getJSON(files){
  if((files)&&(files.length>0)){
      var reader = new FileReader();
    reader.onload = importJSON;
    reader.readAsText(event.target.files[0]);
  }
}
function importJSON(event){
    var newAnn = JSON.parse(event.target.result);

  if(newAnn.objectID == OBJECT_ANNOTATION.objectID){
    OBJECT_ANNOTATION = newAnn;
    fillNotesPanel();
    fillViewsPanel();
    fillSpotsPanel();
    displaySpots();
    toastr.success('Annotations Loaded');
  }
  else{
    toastr.error('Object Mismatch');
  }

}
function sendToCollection(){
  if(SESSION_ID != window.localStorage.getItem("DC_SESSIONID")){
    toastr.error('Lost Synch with Dynamic Collection Page');
    return;
  }
  var message = {};
  message.session = SESSION_ID;
  message.annotations = JSON.stringify(OBJECT_ANNOTATION);

  MESSAGECHANNEL.postMessage(message);
}

function addView(){
  var newName = "V_" + OBJECT_ANNOTATION.newIndex++;
  var newView = {};
  newView.view = null;
  newView.state = {};
  newView.tools = {};
  newView.text = "Description of view " + (OBJECT_ANNOTATION.newIndex-1);
  OBJECT_ANNOTATION.views[newName] = newView;
  updateView(newName);
  fillViewsPanel();
}
function updateViewText(viewID, text){
  OBJECT_ANNOTATION.views[viewID].text = text;
}
function updateView(viewID){
  OBJECT_ANNOTATION.views[viewID].view = track2view(presenter.getTrackballPosition());
  for(field in VIEW_STATE)
    OBJECT_ANNOTATION.views[viewID].state[field] = VIEW_STATE[field];
  // measurements
  if(angleStage == 3){
    var toolState = {}
    toolState.angleA = anglePoints[0];
    toolState.angleB = anglePoints[1];
    toolState.angleC = anglePoints[2];
    OBJECT_ANNOTATION.views[viewID].tools.angleMeasure = toolState;
  }
  else if((presenter._isMeasuringDistance) && (presenter._measurementStage == 3)){
    var toolState = {};
    toolState.distanceA = presenter._pointA;
    toolState.distanceB = presenter._pointB;
    OBJECT_ANNOTATION.views[viewID].tools.distanceMeasure = toolState;
  }
  else if((presenter._isMeasuringPickpoint)&(presenter._pickValid)&&(presenter._onEndPickingPoint == onEndPick)){ //extra condition: I am really pointpicking, or i am picking for another tool?
    var toolState = {};
    toolState.distanceA = presenter._pointA;
    toolState.pickA = presenter._pickedPoint;
    OBJECT_ANNOTATION.views[viewID].tools.pickPoint = toolState;
  }

  // sections

}
function gotoView(viewID){
  for(field in OBJECT_ANNOTATION.views[viewID].state)
    VIEW_STATE[field] = OBJECT_ANNOTATION.views[viewID].state[field];
  displayViewState();
  presenter.animateToTrackballPosition(view2track(OBJECT_ANNOTATION.views[viewID].view));
  if(OBJECT_ANNOTATION.views[viewID].view.fov == "0")
    updateOrtho(true);
  else
    updateOrtho(false);
  // measurements
  if(OBJECT_ANNOTATION.views[viewID].tools.distanceMeasure){
    toolsReset();
    presenter._isMeasuringDistance = true;
    presenter._measurementStage = 3;
    presenter._pointA = OBJECT_ANNOTATION.views[viewID].tools.distanceMeasure.distanceA;
    presenter._pointB = OBJECT_ANNOTATION.views[viewID].tools.distanceMeasure.distanceB;
    measureSwitch(true);
    setInstructions("pick two points A-B on the object to measure their distance");
    onEndMeasure(SglVec3.length(SglVec3.sub(presenter._pointA, presenter._pointB)), presenter._pointA, presenter._pointB);
    presenter.repaint();
  }
  else if(OBJECT_ANNOTATION.views[viewID].tools.pickPoint){
    toolsReset();
    presenter._isMeasuringPickpoint = true;
    presenter._pickValid = true;
    presenter._pickedPoint = OBJECT_ANNOTATION.views[viewID].tools.pickPoint.pickA;
    pickpointSwitch(true);
    setInstructions("pick a point A on the object to read its coordinates");
    onEndPick(presenter._pickedPoint);
    presenter.repaint();
  }
  else if(OBJECT_ANNOTATION.views[viewID].tools.angleMeasure){
    toolsReset();
    enableAngleMeasurement(true);
    setInstructions("pick three points A-O-B on the object to calculate the angle A&Ocirc;B");
    angleStage = 3;
    anglePoints[0] = OBJECT_ANNOTATION.views[viewID].tools.angleMeasure.angleA;
    anglePoints[1] = OBJECT_ANNOTATION.views[viewID].tools.angleMeasure.angleB;
    anglePoints[2] = OBJECT_ANNOTATION.views[viewID].tools.angleMeasure.angleC;
    presenter.repaint();
    displayAngle();
    displayAngleEnd();
  }
  // sections
}
function deleteView(viewID){
  delete OBJECT_ANNOTATION.views[viewID];
  fillViewsPanel();
}

function addSpot(){
  if(IS_EDITING) return;
  presenter._onEndPickingPoint = pickSpot;
  presenter.enablePickpointMode(true);
  $('#draw-canvas').css("cursor","crosshair");
  IS_EDITING = true;
}
function pickSpot(pos){
  presenter._onEndPickingPoint = null;
  presenter.enablePickpointMode(false);
  $('#draw-canvas').css("cursor","default");
  IS_EDITING = false;

  //undo object transform
  var opoint = [pos[0], pos[1], pos[2], 1.0];
  var tpoint = SglMat4.mul4(SglMat4.inverse(presenter._scene.modelInstances["model_specimen_0"].transform.matrix), opoint);

  var newName = "S_" + OBJECT_ANNOTATION.newIndex++;
  var newSpot = {};
  newSpot.pos = [tpoint[0],tpoint[1],tpoint[2]];
  newSpot.text = "spot " + (OBJECT_ANNOTATION.newIndex-1);
  newSpot.visible = true;
  newSpot.radius = 3.0;
  newSpot.color = [0.9, 0.2, 0.2];
  newSpot.group = 1;
  OBJECT_ANNOTATION.spots[newName] = newSpot;
  fillSpotsPanel();
  displaySpots();
}
function cancelPicking(){

}
function updateSpotText(spotID, text){
  OBJECT_ANNOTATION.spots[spotID].text = text;
}
function updateSpotRadius(spotID, value){
  OBJECT_ANNOTATION.spots[spotID].radius = value;
  displaySpots();
}
function updateSpotColor(spotID, value){
  const r = parseInt(value.substr(1,2), 16)
  const g = parseInt(value.substr(3,2), 16)
  const b = parseInt(value.substr(5,2), 16)
  OBJECT_ANNOTATION.spots[spotID].color = [r/255.0, g/255.0, b/255.0];
  displaySpots();
}
function updateSpotVis(spotID, visible){
  OBJECT_ANNOTATION.spots[spotID].visible=visible;
  presenter.setSpotVisibilityByName(spotID,visible,true);
}
function updateAllSpotsVis(visible){
  for (const spot in OBJECT_ANNOTATION.spots){
    OBJECT_ANNOTATION.spots[spot].visible=visible;
    presenter.setSpotVisibilityByName(spot,visible,false);
    presenter.repaint();
    fillSpotsPanel(); // easier to rebuild the panel, than to individually set all checkboxes
  }
}
function deleteSpot(spotID){
  delete OBJECT_ANNOTATION.spots[spotID];
  fillSpotsPanel();
  displaySpots();
}

function displaySpots(){
  if(!presenter._scene) return;
  presenter._scene.spots = {};
  presenter._spotsProgressiveID = 10;  // reset to avoid accumulation

  for (const spot in OBJECT_ANNOTATION.spots){
    var radius = 1.0;
    if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "mm")
      radius = OBJECT_ANNOTATION.spots[spot].radius;
    else if(ARCHIVE.data(OBJCODE,"MEASURE_UNIT") === "m")
      radius = 0.01 * OBJECT_ANNOTATION.spots[spot].radius;

    // place according to current object transform
    var opoint = [OBJECT_ANNOTATION.spots[spot].pos[0], OBJECT_ANNOTATION.spots[spot].pos[1], OBJECT_ANNOTATION.spots[spot].pos[2], 1.0];
    var tpoint = SglMat4.mul4(presenter._scene.modelInstances["model_specimen_0"].transform.matrix, opoint);

    var newSpot = {
      mesh            : "sphere",
      color           : OBJECT_ANNOTATION.spots[spot].color,
      alpha           : 0.7,
      transform : {
        translation : [tpoint[0],tpoint[1],tpoint[2]],
        scale : [radius, radius, radius],
        },
      visible         : OBJECT_ANNOTATION.spots[spot].visible,
    };
    presenter._scene.spots[spot] = presenter._parseSpot(newSpot);
    presenter._scene.spots[spot].rendermode = "FILL";  //maybe this is not necessary
  }

  presenter.repaint();

  presenter.enableOnHover(true);
  presenter._onEnterSpot = onESpot;
  presenter._onLeaveSpot = onLSpot;
}

function onESpot(id){
  document.getElementById("spot_display").innerHTML = "<h4>"+OBJECT_ANNOTATION.spots[id].text+"</h4>";
}
function onLSpot(id){
  document.getElementById("spot_display").innerHTML = "";
}

//-----------------------------------------------------------
function convertToGlobal(trackState)
{
  var newstate=[];
  // angles
  newstate[0] = trackState[0];
  newstate[1] = trackState[1];
  // pan
  newstate[2] = (trackState[2] / presenter.sceneRadiusInv) + presenter.sceneCenter[0];
  newstate[3] = (trackState[3] / presenter.sceneRadiusInv) + presenter.sceneCenter[1];
  newstate[4] = (trackState[4] / presenter.sceneRadiusInv) + presenter.sceneCenter[2];
  //distance
  newstate[5] = trackState[5] / presenter.sceneRadiusInv;
  return newstate;
}
function convertToLocal(trackState)
{
  var newstate=[];
  // angles
  newstate[0] = trackState[0];
  newstate[1] = trackState[1];
  // pan
  newstate[2] = (trackState[2] - presenter.sceneCenter[0]) * presenter.sceneRadiusInv;
  newstate[3] = (trackState[3] - presenter.sceneCenter[1]) * presenter.sceneRadiusInv;
  newstate[4] = (trackState[4] - presenter.sceneCenter[2]) * presenter.sceneRadiusInv;
  //distance
  newstate[5] = trackState[5] * presenter.sceneRadiusInv;
  return newstate;
}
//---------------------------------------------------------
function track2view(trackState){
  var view = {};
  view.space = "object";
  view.position = [0.0,0.0,0.0];
  view.target = [0.0,0.0,0.0];
  view.up = [0.0,0.0,0.0];
  view.fov = 0.0;
  // target is trackball center
  view.target[0] = (trackState[2] / presenter.sceneRadiusInv) + presenter.sceneCenter[0];
  view.target[1] = (trackState[3] / presenter.sceneRadiusInv) + presenter.sceneCenter[1];
  view.target[2] = (trackState[4] / presenter.sceneRadiusInv) + presenter.sceneCenter[2];
  // position is [0,0,distance], rotated on X and Y, added to target
  var dist = trackState[5] / presenter.sceneRadiusInv;
  var vp = [0.0, 0.0, dist, 1.0];
  vp = SglMat4.mul4(SglMat4.rotationAngleAxis(sglDegToRad(trackState[1]), [-1.0, 0.0, 0.0]), vp);
  vp = SglMat4.mul4(SglMat4.rotationAngleAxis(sglDegToRad(trackState[0]), [0.0, 1.0, 0.0]), vp);
  view.position[0] = vp[0] + view.target[0];
  view.position[1] = vp[1] + view.target[1];
  view.position[2] = vp[2] + view.target[2];
  // up is unit vertical vector, rotated on X and Y
  var vu = [0.0, 1.0, 0.0, 1.0];
  vu = SglMat4.mul4(SglMat4.rotationAngleAxis(sglDegToRad(trackState[1]), [-1.0, 0.0, 0.0]), vu);
  vu = SglMat4.mul4(SglMat4.rotationAngleAxis(sglDegToRad(trackState[0]), [0.0, 1.0, 0.0]), vu);
  view.up[0] = vu[0];
  view.up[1] = vu[1];
  view.up[2] = vu[2];

  if(presenter.getCameraType() == "orthographic")
    view.fov = 0.0;
  else
    view.fov = presenter._scene.space.cameraFOV;
  return view;
}
function view2track(view){
  var trackState = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

  trackState[2] = (view.target[0] - presenter.sceneCenter[0]) * presenter.sceneRadiusInv;
  trackState[3] = (view.target[1] - presenter.sceneCenter[1]) * presenter.sceneRadiusInv;
  trackState[4] = (view.target[2] - presenter.sceneCenter[2]) * presenter.sceneRadiusInv;

  var vdir = [(view.target[0]-view.position[0]), (view.target[1]-view.position[1]), (view.target[2]-view.position[2])];
  var len = SglVec3.length(vdir);
  vdir = [vdir[0] / len, vdir[1] / len, vdir[2] / len];
  trackState[5] = len * presenter.sceneRadiusInv;

  trackState[1] = sglRadToDeg(-Math.asin(vdir[1]));
  trackState[0] = sglRadToDeg(Math.asin(-vdir[0] / Math.cos(Math.asin(-vdir[1]))));

  if((trackState[1]<45.0)&&(trackState[1]>-45.0)){
    trackState[0] = sglRadToDeg(Math.asin(-vdir[0] / Math.cos(Math.asin(-vdir[1]))));
    if(vdir[2]>0.0) trackState[0] = 180.0 - trackState[0];
  }
  else   // if tilt is large, better get heading from the up vector
  {
    trackState[0] = sglRadToDeg(Math.asin(-view.up[0] / Math.cos(Math.asin(-view.up[1]))));
    if(view.up[2]>0.0) trackState[0] = 180.0 - trackState[0];
  }

  return trackState;
}
//---------------------------------------------------------

function collapseControls(){
  const rows = document.querySelectorAll('.myCollapse');

  rows.forEach(row => {
    if(row.style.display == "none"){
      row.style.display = "flex";
      row.style.height = "auto";
    }
    else{
      row.style.display = "none";
      row.style.height = "0px";
    }
  });

  onPageResize();
}

//---------------------------------------------------------------------------------------
function onPageResize(){
  resizeCanvas($('#3dhop').parent().width(),$('#3dhop').parent().height());
  if(presenter) presenter.repaint();

  var remainingH = $('#right_column').height() -$('#rr1').height() -$('#rr2').height() -$('#rr3').height() -$('#rr5').height();

  $('#rr6').height(remainingH);

  anchorPanels();
  anchorAnglePanel();

  resizeLightController();
  updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);
}
//---------------------------------------------------------------------------------------
$(document).ready(function(){
  // crate 3dhop presenter
  presenter = new Presenter("draw-canvas");

  // get current session
  SESSION_ID = window.localStorage.getItem("DC_SESSIONID");

  // looking for parameters in webpage address
  var pageParams = parsePageParams();
  if(pageParams["obj"]){
    OBJCODE = decodeURIComponent(pageParams["obj"]);
  }
  else{
    alert("ERROR, OBJECT NOT SPECIFIED");
    return;
  }

  // in the annotation, I take note of which is the object
  OBJECT_ANNOTATION.objectID = OBJCODE;

  // configuration
  toastr.options = {
    "positionClass": "toast-bottom-left",
    "preventDuplicates": false,
    "showDuration": "300",
    "hideDuration": "300",
    "timeOut": "2000",
    "extendedTimeOut": "1000"
  }

  // start tooltips
  $('[data-toggle="tooltip"]').tooltip({trigger : 'hover'});

  // JSON loading of collection list
  var anticache = "?v=" + Math.floor(Math.random() * 1000);
    jQuery.getJSON("./data/" + LISTFILE + anticache, function(data){
    ARCHIVE.objects = data;

    // fill interface
    var objName=""
    objName += "<h4><b>" + ARCHIVE.data(OBJCODE,"MUSEUM") + " " + ARCHIVE.data(OBJCODE,"INVENTORY") + "</b></h4>";
    objName += "<h6>code: " + ARCHIVE.data(OBJCODE,"3D_OBJECT_ID") +"</h6>";
    document.getElementById("sp_objDetails").innerHTML = objName;

    document.title = OBJCODE;

    fillMetadataPanel();
    fillNotesPanel();
    fillViewsPanel();
    fillSpotsPanel();
    fillScenePanel();

    // start viewer
    init3dhop();
    setup3dhop();

    // initialization light component
    setupLightController();
    // setting starting lightposition
    presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]); // inverted y
    resizeLightController();
    updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);

    // resize all components
    onPageResize();

    // grid shows up at startup
    setTimeout(startupGrid, 200);

    if(pageParams["coll"])
    {
      var storedC = window.localStorage.getItem("DC_COLLECTION");
      if(storedC) {
        COLLECTION = JSON.parse(storedC);
      }
      else {
        alert("ERROR, FAILED SYNCH WITH DYNAMIC COLLECTION PAGE");
        return;
      }

      //change header color
      document.getElementById("rr1").classList.add("bg_card_col");

      // display "to collection" button
      document.getElementById("bt_annToColl").style.display = "inline-block";

      // message channel to send updates to collection
      MESSAGECHANNEL = new BroadcastChannel('collections_channel');

      if(COLLECTION.objects[OBJCODE].newIndex){
        OBJECT_ANNOTATION.newIndex = COLLECTION.objects[OBJCODE].newIndex;
      }

      // annotations from collection to interface
      if(COLLECTION.objects[OBJCODE].notes){
        OBJECT_ANNOTATION.notes = COLLECTION.objects[OBJCODE].notes;
        fillNotesPanel();
      }
      if(COLLECTION.objects[OBJCODE].views){
        OBJECT_ANNOTATION.views = COLLECTION.objects[OBJCODE].views;
        fillViewsPanel();
      }
      if(COLLECTION.objects[OBJCODE].spots){
        OBJECT_ANNOTATION.spots = COLLECTION.objects[OBJCODE].spots;
        fillSpotsPanel();
        displaySpots();
      }
    }

  });
});

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
