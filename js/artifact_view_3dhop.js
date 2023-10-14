let presenter, scene, paradata, gStep;
const canvas = document.getElementById("draw-canvas");
// const lightControllerCanvas = document.getElementById("lightcontroller_canvas");

const instanceOpt = {"nxz" : {
  mesh : "nxz",
  tags: ['Group'],
  color : [0.5, 0.5, 0.5],
  backfaceColor : [0.5, 0.5, 0.5, 3.0],
  specularColor : [0.0, 0.0, 0.0, 256.0]
}}
const trackBallOpt = {
  type : TurntablePanTrackball,
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
const sceneBB = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];


function initModel(model){
  paradata = model.model_param
  scene = {
    meshes: {"nxz" : { url: 'archive/models/'+model.model.nxz }},
    modelInstances : instanceOpt,
    trackball: trackBallOpt,
    space: spaceOpt,
    config: configOpt
  }
  init3dhop();
  presenter = new Presenter("draw-canvas");
  presenter.setScene(scene);
  startupGrid()

  switch (paradata.measure_unit) {
    case 'mm': gStep = 10.0; break;
    case 'm': gStep = 0.01; break;
    default: gStep = 1.0; break;
  }
}


// reset view btn
function home(){
	presenter.resetTrackball();
	// put back light as we want it, as resetTrackball() function resets it
	// presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]); // inverted y
	// updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);
}

// set view dropdown
function viewFrom(direction){
	var distance = 1.3;
  let dir = direction.split(',');
  dir.push(distance);
  presenter.animateToTrackballPosition(dir);
}

// ortho checkbox
function updateOrtho(){
  $("[name=ortho]").is(':checked') 
    ? presenter.setCameraOrthographic()
    : presenter.setCameraPerspective() 
}

// texture-plain color checkbox
function updateTexture(){
  let state = $("[name=texture]").is(':checked')
  presenter.setInstanceSolidColor('Group', state, false);
  presenter.repaint();
}

// transparent-solid checkbox
function updateTransparency(){
  let state = $("[name=solid]").is(':checked');
  presenter.setInstanceTransparency('Group', state, false);
  presenter.repaint();
}

// lighting-diffuse checkbox
function updateLighting(){
  let state = $("[name=lighting]").is(':checked')
  presenter.enableSceneLighting(state);
  presenter.repaint();
}

// specular-diffuse checkbox
function updateSpecular(){
  let spec = $("[name=specular]").is(':checked') ? [0.3,0.3,0.3,256.0] : [0.0,0.0,0.0,256.0];
  for (inst in presenter._scene.modelInstances){
    presenter._scene.modelInstances[inst].specularColor = spec;
  }
  presenter.repaint();
}

// switch XYZ axes
function addAxes(){
	var rad = (1.0 / presenter.sceneRadiusInv)/2.0;
	var linesBuffer;
	var point, tpoint;
	
	point = [rad, 0.0, 0.0, 1.0]
	tpoint = SglMat4.mul4(presenter._scene.modelInstances["nxz"].transform.matrix, point);
	linesBuffer = [];
	linesBuffer.push([0, 0, 0]);
	linesBuffer.push([tpoint[0], tpoint[1], tpoint[2]]);	
	var axisX = presenter.createEntity("XXaxis", "lines", linesBuffer);
	axisX.color = [1.0, 0.2, 0.2, 1.0];
	axisX.zOff = 0.0;
	
	point = [0.0, rad, 0.0, 1.0]
	tpoint = SglMat4.mul4(presenter._scene.modelInstances["nxz"].transform.matrix, point);
	linesBuffer = [];
	linesBuffer.push([0, 0, 0]);
	linesBuffer.push([tpoint[0], tpoint[1], tpoint[2]]);	
	var axisY = presenter.createEntity("YYaxis", "lines", linesBuffer);
	axisY.color = [0.2, 1.0, 0.2, 1.0];
	axisY.zOff = 0.0;

	point = [0.0, 0.0, rad, 1.0]
	tpoint = SglMat4.mul4(presenter._scene.modelInstances["nxz"].transform.matrix, point);	
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

//// Grid functions ////////////////////////////////////
function startupGrid(){
  for(inst in presenter._scene.modelInstances){
    let vv = presenter._scene.meshes[presenter._scene.modelInstances[inst].mesh].renderable.mesh.basev;
    if (typeof vv === 'undefined') {
      setTimeout(startupGrid, 50);
      return;
    }
  }
  // computeEncumbrance();
  addBaseGrid();
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

function addBoxGrid() {
	computeSceneBB();

	var Xsteps,Ysteps,Zsteps,ii;
	var XC = (sceneBB[0] + sceneBB[3]) / 2.0;
	var YC = (sceneBB[1] + sceneBB[4]) / 2.0;
	var ZC = (sceneBB[2] + sceneBB[5]) / 2.0;
	
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

function changeGrid(currentGrid,newGrid) {
  if (currentGrid !== 'gridOff') {
    presenter.deleteEntity(currentGrid)
  }
  switch (newGrid) {
    case 'gridBase': addBaseGrid(); break;
    case 'gridBox': addBoxGrid(); break;
    case 'gridBB': addBBGrid(); break;
    case 'gridOff': presenter.deleteEntity(currentGrid); break;
  }
}