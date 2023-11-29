const artifactId = $("[name=artifactId]").val()
const activeUser = $("[name=activeUsr]").val()
const role = $("[name=role]").val()
const canvas = document.getElementById("draw-canvas");
const instanceOpt = {"nxz":{ mesh:"nxz", tags: ['Group'], color: [0.5, 0.5, 0.5], backfaceColor: [0.5, 0.5, 0.5, 3.0], specularColor: [0.0, 0.0, 0.0, 256.0]}}
const trackBallOpt = { type: TurntablePanTrackball, trackOptions: {startPhi: 15.0, startTheta: 15.0, startDistance: 2.0, minMaxPhi: [-180, 180], minMaxTheta: [-90.0, 90.0], minMaxDist: [0.1, 3.0] }}
const spaceOpt = {centerMode: "scene", radiusMode: "scene", cameraNearFar: [0.01, 5.0]}
const configOpt = {pickedpointColor: [1.0, 0.0, 1.0], measurementColor: [0.5, 1.0, 0.5], showClippingPlanes: true, showClippingBorder: true, clippingBorderSize: 0.5, clippingBorderColor: [0.0, 1.0, 1.0]}
const sceneBB = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
const defaultViewSide = '15,15,0,0,0,2';

let presenter, scene, paradata, gStep, measure_unit;
let angleStage = 0;
let anglePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
let lightDir = [-0.17,-0.17];
let viewList = {}
let viewIndex = 0;
let spotList = {}
let spotIndex = 0;

$("[name=toggleViewSpot]").on('click', function(){
  $(this).find('span').toggleClass('mdi-chevron-down mdi-chevron-up');
})

var toolBtnList = [].slice.call(document.querySelectorAll('.toolBtn'))
var tooltipBtnList = toolBtnList.map(function (tooltipBtn) { return new bootstrap.Tooltip(tooltipBtn,{trigger:'hover', html: true, placement:'left' })})
$("[name=fullscreenToggle]").on('click', function(){
  let act = $(this).data('action') == 'fullscreen_in' ? 'fullscreen_out' : 'fullscreen_in';
  $(this).find('span').toggleClass('mdi-fullscreen mdi-fullscreen-exit')
  $(this).data('action', act);
})
$("#modelToolsH button").on('click', function(){
  actionsToolbar($(this).data('action'))
})

$("[name=viewside]").on('click', function(e){ 
  e.preventDefault()
  let label = $(this).text()
  $(this).addClass('active')
  $("[name=viewside]").not(this).removeClass('active')
  viewFrom($(this).val()) 
  $("#dropdownViewList").text(label)
})
$("[name=ortho]").on('click', function(){updateOrtho()})
$("[name=texture]").on('click', function(){
  let label = $(this).is(':checked') ? 'plain color' : 'texture';
  $(this).next('label').text(label);
  updateTexture()
})
$("[name=solid]").on('click', function(){
  let label = $(this).is(':checked') ? 'transparent' : 'solid';
  $(this).next('label').text(label);
  updateTransparency()
})
$("[name=lighting]").on('click', function(){
  let label = $(this).is(':checked') ? 'unshaded' : 'lighting';
  $(this).next('label').text(label);
  updateLighting()
})
$("[name=specular]").on('click', function(){
  let label = $(this).is(':checked') ? 'specular' : 'diffuse';
  $(this).next('label').text(label);
  updateSpecular()
})

$("[name=changeGrid]").on('click', function(e){ 
  e.preventDefault()
  let label = $(this).text()
  let newGrid = $(this).val()
  let currentGrid = $("#gridListValue").find('.active').val();
  $(this).addClass('active')
  $("[name=changeGrid]").not(this).removeClass('active')
  $("#dropdownGridList").text(label)
  changeGrid(currentGrid,newGrid);
})

$("[name=xyzAxes]").on('click', function(){
  $(this).is(':checked') ? addAxes() : removeAxes();
})

$(".measureTool").on('click', function(){
  let func = $(this).prop('id')
  disableToolsFunction()
  if($(this).is(':checked')){ 
    $(".measureTool").not(this)/*.not("#section")*/.prop('checked', false) 
  }
  // if(func !== 'section'){}
  let act = $(this).is(':checked') ? func+'_on' : func+'_off';
  actionsToolbar(act);
})

$("#sectionReset").on('click',sectionReset)

$(".togglePlaneIco").on('click', function(){
  let plane = $(this).prop('id').substring(0, 1);
  let currentSrc = $(this).prop('src').split('/').pop();
  let state;
  switch (plane) {
    case 'x':
      state = currentSrc == 'sectionX_off.png' ? true : false;
      sectionxSwitch(state)
    break;   
    case 'y':
      state = currentSrc == 'sectionY_off.png' ? true : false;
      sectionySwitch(state)
    break;  
    case 'z':
      state = currentSrc == 'sectionZ_off.png' ? true : false;
      sectionzSwitch(state)
    break;
  }
})

$("#sections-box input[type=range]").on('input', function(){
  let plane = $(this).attr('name').substring(0, 1)
  let val = $(this).val()
  switch (plane) {
    case 'x':
      sectionxSwitch(true); 
      presenter.setClippingPointX(val);   
    break;
    case 'y':
      sectionySwitch(true); 
      presenter.setClippingPointY(val); 
    break;
    case 'z':
      sectionzSwitch(true); 
      presenter.setClippingPointZ(val); 
    break;
  }
})

$("[name=planeFlipCheckbox").on('click', function(){
  let plane = $(this).attr('id').substring(0, 1)
  switch (plane) {
    case 'x':
      sectionxSwitch(true);
      let clipXVal = $('#xplaneFlip').is(':checked') ? -1 : 1;
      presenter.setClippingX(clipXVal);   
      break;
      case 'y':
        sectionySwitch(true);
      let clipYVal = $('#yplaneFlip').is(':checked') ? -1 : 1;
      presenter.setClippingY(clipYVal); 
      break;
      case 'z':
        sectionzSwitch(true);
        let clipZVal = $('#zplaneFlip').is(':checked') ? -1 : 1;
      presenter.setClippingZ(clipZVal); 
    break;
  }
})

$("#showPlane").on('click', function(){
  presenter.setClippingRendermode($(this).is(':checked'), presenter.getClippingRendermode()[1]);
})

$("#showBorder").on('click', function(){
  presenter.setClippingRendermode(presenter.getClippingRendermode()[0], $(this).is(':checked'));
})
$("[name=addViewBtn]").on('click',addView)


/////////////////////////////////////////////////////////////
//////////////// FUNCTIONS //////////////////////////////////
/////////////////////////////////////////////////////////////

function initModel(model){
  paradata = model.model_param
  measure_unit = paradata.measure_unit;
  let param = model.model_view
  scene = {
    meshes: {
      "nxz" : {
        url: 'archive/models/'+model.model_object.object 
      }
    }, 
    modelInstances: instanceOpt, 
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
  //light component
  setupLightController()
  resizeLightController()
  updateLightController(lightDir[0],lightDir[1])
  // se vuoi disabilitare la visibilità dei piani di sezione
  // presenter.setClippingRendermode(false, presenter.getClippingRendermode()[1])
  
  switch (measure_unit) {
    case 'mm': gStep = 10.0; break;
    case 'm': gStep = 0.01; break;
    default: gStep = 1.0; break;
  }
  
  startupGrid(param.grid)
  presenter.animateToTrackballPosition(param.viewside.split(',').map(Number))
  lightDir = model.model_view.lightdir.split(',').map(Number)
  presenter.rotateLight(lightDir[0],-lightDir[1])
  let viewsideLabel = getViewside(param.viewside)
  if(param.viewside !== defaultViewSide && viewsideLabel !== ''){
    $("[name=viewside][value='"+param.viewside+"']").addClass('active')
    $("#dropdownViewList").text(viewsideLabel)
  }
  $("[name=changeGrid][value=gridBase").removeClass('active')
  $("[name=changeGrid][value="+param.grid+"]").addClass('active')
  let gridLabel = $("[name=changeGrid][value="+param.grid+"]").text()
  $("#dropdownGridList").text(gridLabel)
  if(param.ortho==1){ $("[name=ortho]").trigger('click') }
  if(param.xyz==1){ setTimeout(function(){ $("[name=xyzAxes]").trigger('click') },100) }
  if (param.texture == 1) { $("[name=texture]").trigger('click') }
  if(param.solid ==1){$("[name=solid]").trigger('click')}
  if(param.lighting == 1){$("[name=lighting]").trigger('click')}
  if(param.specular == 1){$("[name=specular]").trigger('click')}
}

function getViewside(viewside){
  let viewsideLabel='';
  switch (viewside) {
    case '0,90,0.0,0.0,0.0,1.3': viewsideLabel='top'; break;
    case '0,-90,0.0,0.0,0.0,1.3': viewsideLabel='bottom'; break;
    case '0,0,0.0,0.0,0.0,1.3': viewsideLabel='front'; break;
    case '-90,0,0.0,0.0,0.0,1.3': viewsideLabel='left'; break;
    case '90,0,0.0,0.0,0.0,1.3': viewsideLabel='right'; break;
    case '180,0,0.0,0.0,0.0,1.3': viewsideLabel='back'; break;
  }
  return viewsideLabel;
}
function actionsToolbar(action) {
  switch (action) {
    case "home": home(); break;
    case "zoomin": presenter.zoomIn(); break;
    case "zoomout": presenter.zoomOut(); break;
    case "fullscreen_in":
    case "fullscreen_out": fullscreenSwitch(action); break;
    case "screenshot": presenter.saveScreenshot(); break;
    case "light_on":
      // presenter.enableLightTrackball(true);
      // checkLight(true);
      setInstructions("click the left mouse button and drag the cursor on model to change the light origin")
      sectionToolInit(false)
      measureSwitch(false);
      $("#lightCanvas-box").removeClass('invisible')
    break;
    case "light_off":
      // checkLight(false);
      clearInstructions();
      $("#lightCanvas-box").addClass('invisible')
    break;
    case "measure_on":
      presenter.enableMeasurementTool(true);
      measureSwitch(true);
      $("#measure-box-title").text('Measured length')
      $("#measure-output").text('0.00'+measure_unit);
		  setInstructions("pick two points A-B on the object to measure their distance")
    break;
    case "measure_off":
      measureSwitch(false);
		  clearInstructions();
    break;
    case "pick_on": 
      presenter.enablePickpointMode(true);
      measureSwitch(true);
      $("#measure-box-title").text('XYZ picked point')
      $("#measure-output").text('[ 0 , 0 , 0 ]');
      setInstructions("pick a point A on the object to read its coordinates");
    break;
    case "pick_off":
      measureSwitch(false);
		  clearInstructions();
    break;
    case "angle_on": 
      enableAngleMeasurement(true);
      measureSwitch(true);
      $("#measure-box-title").text('Angle')
      $("#measure-output").text('0°');
      setInstructions("pick three points A-O-B on the object to calculate the angle A&Ocirc;B");
    break;
    case "angle_off":
      enableAngleMeasurement(false);
      measureSwitch(false);
		  clearInstructions();
    break;
    case "section_on":
      sectionToolInit(true)
    break;
    case "section_off":
      sectionToolInit(false)
    break;
  }
}

function measureSwitch(state) {
  if(state){
    $('#measure-box').removeClass('invisible').fadeIn('fast');
    $('#draw-canvas').css("cursor","crosshair");
  }else{
    $('#measure-box').addClass('invisible').fadeOut('fast');
    $('#draw-canvas').css("cursor","default");
  }
}

function disableToolsFunction(){
  presenter.enableLightTrackball(false);
  presenter.enableMeasurementTool(false);
  presenter.enablePickpointMode(false);
  enableAngleMeasurement(false);
  sectionToolInit(false)
  $("#lightCanvas-box").addClass('invisible')
}

function fullscreenSwitch(action) {
  if(action == 'fullscreen_in'){
    if (window.navigator.userAgent.indexOf('Trident/') < 0) enterFullscreen();
  }
  else{
    if (window.navigator.userAgent.indexOf('Trident/') < 0) exitFullscreen();
  }
}

function enterFullscreen() {
  if (isIOS()) return; //IOS DEVICES CHECK

  presenter._nativeWidth  = presenter.ui.width;
  presenter._nativeHeight = presenter.ui.height;
  presenter._nativeResizable = presenter._resizable;
  presenter._resizable = true;

  var viewer = $('#3dhop')[0];
  if (viewer.msRequestFullscreen) viewer.msRequestFullscreen();
  else if (viewer.mozRequestFullScreen) viewer.mozRequestFullScreen();
  else if (viewer.webkitRequestFullscreen) viewer.webkitRequestFullscreen();

  presenter.ui.postDrawEvent();
}

function exitFullscreen() {

  if (isIOS()) return; //IOS DEVICES CHECK

  $('#draw-canvas').attr('width', presenter._nativeWidth);
  $('#draw-canvas').attr('height',presenter._nativeHeight);
  $('#3dhop').css('width', presenter._nativeWidth);
  $('#3dhop').css('height', presenter._nativeHeight);
  presenter._resizable = presenter._nativeResizable;

  if (document.msExitFullscreen) document.msExitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();

  presenter.ui.postDrawEvent();
}


// reset view btn
function home(){
  // presenter.resetTrackball();
  presenter.animateToTrackballPosition([15,15,0,0,0,2]);
	presenter.rotateLight(0,0);
  lightDir = [0,0];
  $("[name=viewside").removeClass('active')
  $("#dropdownViewList").text('set view')
}

// set view dropdown
function viewFrom(direction){ presenter.animateToTrackballPosition(direction.split(',')) }

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
  let state = $("[name=lighting]").is(':checked') ? false : true;
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
function startupGrid(grid){
  for(inst in presenter._scene.modelInstances){
    let vv = presenter._scene.meshes[presenter._scene.modelInstances[inst].mesh].renderable.mesh.basev;
    if (typeof vv === 'undefined') {
      setTimeout(function(){startupGrid(grid)},50)
      return;
    }
  }
  // computeEncumbrance();
  switch (grid) {
    case 'gridBase': addBaseGrid(); break;
    case 'gridBox': addBoxGrid(); break;
    case 'gridBB': addBBGrid(); break;
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
    if(tpoint[0] > sceneBB[0]) sceneBB[0] = tpoint[0];
    if(tpoint[1] > sceneBB[1]) sceneBB[1] = tpoint[1];
    if(tpoint[2] > sceneBB[2]) sceneBB[2] = tpoint[2];
    if(tpoint[0] < sceneBB[3]) sceneBB[3] = tpoint[0];
    if(tpoint[1] < sceneBB[4]) sceneBB[4] = tpoint[1];
    if(tpoint[2] < sceneBB[5]) sceneBB[5] = tpoint[2];
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
	for (ii=0; ii<=Ysteps; ii+=1){
			linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[2]]);
			linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[5]]);
			linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[2]]);
			linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[5]]);
	}
	for (ii=0; ii<=Zsteps; ii+=1){
			linesBuffer.push([boxG[3], boxG[1], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[3], boxG[4], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[0], boxG[1], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[0], boxG[4], boxG[5]+(gStep*ii)]);
	}
	//--------------------Y
	for (ii =0; ii <= Xsteps; ii+=1){
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[2]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[5]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[2]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[5]]);
	}
	for (ii = 0; ii <= Zsteps; ii+=1){
			linesBuffer.push([boxG[0], boxG[4], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[3], boxG[4], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[0], boxG[1], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[3], boxG[1], boxG[5]+(gStep*ii)]);
	}
	//--------------------Z
	for (ii =0; ii <= Xsteps; ii+=1){
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[5]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[5]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[2]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[2]]);
	}
	for (ii = 0; ii <= Ysteps; ii+=1){
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
	
	for (gg = -numDiv; gg <= numDiv; gg+=1){
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
  if (currentGrid !== 'gridOff') { presenter.deleteEntity(currentGrid); }
  switch (newGrid) {
    case 'gridBase': addBaseGrid(); break;
    case 'gridBox': addBoxGrid(); break;
    case 'gridBB': addBBGrid(); break;
    case 'gridOff': presenter.deleteEntity(currentGrid); break;
  }
}

function setInstructions(text){	
  $('#panel_instructions').html(text).removeClass('invisible').fadeIn('fast'); 
}
function clearInstructions(){	
  $('#panel_instructions').html("").addClass('invisible').fadeOut('fast'); 
}
function onEndMeasure(measure) {
	var clampTo = (measure_unit == "m")? 3 : 2;
	$('#measure-output').html(measure.toFixed(clampTo) + measure_unit); 
}
function onEndPick(point) {
	var clampTo = (measure_unit == "m")? 3 : 2;
	//undo object transform
	var opoint = [point[0], point[1], point[2], 1.0];	
	var tpoint = SglMat4.mul4(SglMat4.inverse(presenter._scene.modelInstances["nxz"].transform.matrix), opoint);
	var x = tpoint[0].toFixed(clampTo);
	var y = tpoint[1].toFixed(clampTo);
	var z = tpoint[2].toFixed(clampTo);
  $('#measure-output').html("[ "+x+" , "+y+" , "+z+" ]");
}

function enableAngleMeasurement(state){
	if(state){
		resetAngle();
		presenter._onEndPickingPoint = onAnglePick;
		presenter.enablePickpointMode(true);	
	}else{
		presenter.deleteEntity("angleP");
		presenter.deleteEntity("angleL");
		presenter.deleteEntity("angleV");
		presenter.enablePickpointMode(false);
		presenter._onEndPickingPoint = onEndPick;
		resetAngle();		
	}
}

function onAnglePick(point) {
	if(angleStage == 3){ angleStage = 0; }//reset for new measure
	anglePoints[angleStage] = [point[0],point[1],point[2]];
	angleStage++;
	displayAngle();
	if(angleStage == 3){displayAngleEnd();}
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
	$('#measure-output').html(angle.toFixed(2) + "&deg;");

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

function sectionToolInit(state){
  if(state){
    measureSwitch(false)
    clearInstructions()
    $("#sections-box").removeClass('invisible').fadeIn('fast')
    return false;
  }
  $("#sections-box").addClass('invisible').fadeOut('fast')
}

function sectionReset(){
  sectionxSwitch(false)
  sectionySwitch(false)
  sectionzSwitch(false)
  presenter.setClippingX(0);
  presenter.setClippingY(0);
  presenter.setClippingZ(0);
  togglePlanesEdgesTool()
  $("#sections-box").find("[type=range").val(0.5)
  $("[name=planeFlipCheckbox]").prop('checked', false)
}

function sectionxSwitch(state) {
	if(state){
    $("#xplane").attr('src', 'img/ico/sectionX_on.png');
    let clipVal = $('#xplaneFlip').is(':checked') ? -1 : 1;
		presenter.setClippingX(clipVal);
	}else{
    $("#xplane").attr('src', 'img/ico/sectionX_off.png');
    presenter.setClippingX(0);
  }
  togglePlanesEdgesTool()
}

function sectionySwitch(state) {
	if(state){
    $("#yplane").attr('src', 'img/ico/sectionY_on.png');
    let clipVal = $('#xplaneFlip').is(':checked') ? -1 : 1;
		presenter.setClippingY(clipVal);
	}else{
    $("#yplane").attr('src', 'img/ico/sectionY_off.png');
    presenter.setClippingY(0);
  }
  togglePlanesEdgesTool()
}

function sectionzSwitch(state) {
  if(state){
    $("#zplane").attr('src', 'img/ico/sectionZ_on.png');
    let clipVal = $('#zplaneFlip').is(':checked') ? -1 : 1;
		presenter.setClippingZ(clipVal);
	}else{
    $("#zplane").attr('src', 'img/ico/sectionZ_off.png');
    presenter.setClippingZ(0);
  }
  togglePlanesEdgesTool()
}

function togglePlanesEdgesTool(){
  if(presenter.getClippingX() == 0 && presenter.getClippingY() == 0 && presenter.getClippingZ() == 0){
    $("#planesEdgesDiv").addClass('invisible')
  }else{
    $("#planesEdgesDiv").removeClass('invisible')
  }
}

// views
function addView(){
  viewIndex++;
  let newView = {}
  newView.view = null;
	newView.state = {};
	newView.tools = {};
	newView.text = "Description of view " + viewIndex;
	viewList[viewIndex] = newView;
	updateView(viewIndex);
	fillViewsPanel();
}

function updateView(view){
  viewList[view].view = track2view(presenter.getTrackballPosition());
  // l'oggetto VIEW_STATE non mi serve
	// for(field in VIEW_STATE){viewList[view].state[field] = VIEW_STATE[field]};
  viewList[view].state['viewside'] = presenter.getTrackballPosition();
  viewList[view].state['grid'] = $("#gridListValue").find('.active').val();
  viewList[view].state['ortho'] = $("[name=ortho]").is(':checked');
  viewList[view].state['axes'] = $("[name=xyzAxes]").is(':checked');
  viewList[view].state['lightDir'] = lightDir;
  viewList[view].state['solid'] = $("[name=texture]").is(':checked');
  viewList[view].state['transparency'] = $("[name=solid]").is(':checked');
  viewList[view].state['lighting'] = $("[name=lighting]").is(':checked');
  viewList[view].state['specular'] = $("[name=specular]").is(':checked');
  
	// measurements
	if(angleStage == 3){
    var toolState = {}
		toolState.angleA = anglePoints[0];
		toolState.angleB = anglePoints[1];
		toolState.angleC = anglePoints[2];
		viewList[view].tools.angleMeasure = toolState;
	}	
  else if((presenter._isMeasuringDistance) && (presenter._measurementStage == 3)){
		var toolState = {};
		toolState.distanceA = presenter._pointA;
		toolState.distanceB = presenter._pointB;
		viewList[view].tools.distanceMeasure = toolState;
	}
	else if((presenter._isMeasuringPickpoint)&(presenter._pickValid)&&(presenter._onEndPickingPoint == onEndPick)){ 
    //extra condition: I am really pointpicking, or i am picking for another tool?
		var toolState = {};
		toolState.distanceA = presenter._pointA;
		toolState.pickA = presenter._pickedPoint;
		viewList[view].tools.pickPoint = toolState;
	}
}

function deleteView(view){
  if(confirm('A view is being deleted, are you sure?')){
    viewIndex--;
    delete viewList[view];
    fillViewsPanel();
  }
}

function gotoView(view){
	for(field in viewList[view].state){VIEW_STATE[field] = viewList[view].state[field];}
	displayViewState();
	presenter.animateToTrackballPosition(view2track(viewList[view].view));
  viewList[view].view.fov == "0" ? updateOrtho(true) : updateOrtho(false);
	// measurements
	if(viewList[view].tools.distanceMeasure){
		toolsReset();
		presenter._isMeasuringDistance = true;
		presenter._measurementStage = 3;
		presenter._pointA = viewList[view].tools.distanceMeasure.distanceA;
		presenter._pointB = viewList[view].tools.distanceMeasure.distanceB;
		measureSwitch(true);
		setInstructions("pick two points A-B on the object to measure their distance");		
		onEndMeasure(SglVec3.length(SglVec3.sub(presenter._pointA, presenter._pointB)), presenter._pointA, presenter._pointB);
		presenter.repaint();
	}	else if(viewList[view].tools.pickPoint){
		toolsReset();
		presenter._isMeasuringPickpoint = true;
		presenter._pickValid = true;
		presenter._pickedPoint = viewList[view].tools.pickPoint.pickA;
		pickpointSwitch(true);
		setInstructions("pick a point A on the object to read its coordinates");		
		onEndPick(presenter._pickedPoint);
		presenter.repaint();		
	}	else if(viewList[view].tools.angleMeasure){
		toolsReset();
		enableAngleMeasurement(true);
		setInstructions("pick three points A-O-B on the object to calculate the angle A&Ocirc;B");		
		angleStage = 3;
		anglePoints[0] = viewList[view].tools.angleMeasure.angleA;
		anglePoints[1] = viewList[view].tools.angleMeasure.angleB;
		anglePoints[2] = viewList[view].tools.angleMeasure.angleC;
		presenter.repaint();
		displayAngle();
		displayAngleEnd();
	}
}

function fillViewsPanel(){
  const wrapDiv = $("#wrapViews");
  if(viewIndex == 0){
    wrapDiv.html('No views');
    $("[name=saveViewBtn").addClass('invisible')
    return false;
  }
  wrapDiv.html('');

  for (const view in viewList) {
    let viewDiv = $("<div/>", {class:'view mb-3'}).appendTo(wrapDiv);
    let viewToolbar = $("<div/>", {class:'viewToolbar'}).appendTo(viewDiv);
    let viewDescription = $("<div/>", {class:'viewDescription'}).appendTo(viewDiv);
    let btnGroup = $("<div/>", {class:'btn-group-vertical', role:'group'}).appendTo(viewToolbar);
    let go2viewBtn = $("<button/>", {class:'btn btn-secondary btn-sm', title:'go to view'}).attr({"data-bs-toggle":"tooltip", "data-bs-placement":"left"}).appendTo(btnGroup).tooltip();
    let updateviewBtn = $("<button/>", {class:'btn btn-secondary btn-sm', title:"edit view"}).attr({"data-bs-toggle":"tooltip", "data-bs-placement":"left"}).appendTo(btnGroup).tooltip();
    let deleteviewBtn = $("<button/>", {class:'btn btn-secondary btn-sm', title:"delete view"}).attr({"data-bs-toggle":"tooltip", "data-bs-placement":"left"}).appendTo(btnGroup).tooltip();
    $("<span/>", {class:'mdi mdi-cube-scan'}).appendTo(go2viewBtn)
    $("<span/>", {class:'mdi mdi-pencil'}).appendTo(updateviewBtn)
    $("<span/>", {class:'mdi mdi-delete-forever'}).appendTo(deleteviewBtn)
    $("<textarea/>",{rows:5, class:'form-control'}).css("resize","none").val(viewList[view]['text']).appendTo(viewDescription)
    deleteviewBtn.on('click', function(){
      $(this).tooltip('hide');
      deleteView(view)
    })
  }
  if(activeUser){$("[name=saveViewBtn").removeClass('invisible');}
}

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
	else 	// if tilt is large, better get heading from the up vector
	{
		trackState[0] = sglRadToDeg(Math.asin(-view.up[0] / Math.cos(Math.asin(-view.up[1]))));
		if(view.up[2]>0.0) trackState[0] = 180.0 - trackState[0];
	}
	return trackState;
}

function displayViewState(){
	$('#i_solidColor').bootstrapToggle((VIEW_STATE.solid)?'on':'off', true);
	presenter.setInstanceSolidColor('Group', VIEW_STATE.solid, false);

	$('#i_transparency').bootstrapToggle((VIEW_STATE.transparency)?'on':'off', true);
	presenter.setInstanceTransparency('Group', VIEW_STATE.transparency, false);

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

	presenter.rotateLight(VIEW_STATE.lightDir[0],-VIEW_STATE.lightDir[1]);
	updateLightController(VIEW_STATE.lightDir[0],VIEW_STATE.lightDir[1]);
	
	presenter.repaint();
}
///////////////////
// LIGHT CONTROL //
///////////////////
function resizeLightController(){
  var lightControllerCanvas = document.getElementById("lightcontroller");
  var dim = Math.min(250, Math.min(lightControllerCanvas.parentElement.clientWidth,lightControllerCanvas.parentElement.clientHeight));
  lightControllerCanvas.width = dim;
  lightControllerCanvas.height = dim;
}
function updateLightController(xx,yy) {
  var lightControllerCanvas = document.getElementById("lightcontroller");
  var cwidth = lightControllerCanvas.width;
  var cheight = lightControllerCanvas.height;
  var midpoint = [Math.floor(cwidth/2.0),Math.floor(cheight/2.0)];
  var radius = Math.min(midpoint[0],midpoint[1]);

  var context = lightControllerCanvas.getContext("2d");
  context.clearRect(0, 0, cwidth, cheight);

  context.beginPath();
  context.arc(midpoint[0], midpoint[1], radius, 0, 2 * Math.PI, false);
  var grd=context.createRadialGradient(midpoint[0]+(xx*(radius-3)*2),midpoint[1]+(yy*(radius-3)*2),3,midpoint[0], midpoint[1],radius);
  grd.addColorStop(0,"rgb(255,255,168)");
  grd.addColorStop(1,"rgb(0,0,0)");
  context.fillStyle = grd;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  context.stroke();

  presenter.ui.postDrawEvent();
}

function clickLightController(event) {
  var lightControllerCanvas = document.getElementById("lightcontroller");
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

    lightDir = [lx,ly];
    
    presenter.rotateLight(lightDir[0],-lightDir[1]); // inverted y
    updateLightController(lightDir[0],lightDir[1]);

    (event.touches) ? lightControllerCanvas.addEventListener("touchmove", clickLightController, false) : lightControllerCanvas.addEventListener("mousemove", clickLightController, false);
  }
}

function setupLightController() {
  // touch and click management
  var canvas = document.getElementById("draw-canvas");
  var lightControllerCanvas = document.getElementById("lightcontroller");
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


function getLight(event) {
  let cwidth = canvas.width;
  let cheight = canvas.height;
  let midpoint = [Math.floor(cwidth/2.0),Math.floor(cheight/2.0)];
  let radius = Math.min(midpoint[0],midpoint[1]);

  let XX = event.offsetX - midpoint[0];
  let YY = event.offsetY - midpoint[1];

  // check inside circle
  if((XX*XX + YY*YY) < ((radius)*(radius))) {
    let lx = (XX / radius)/2.0;
    let ly = (YY / radius)/2.0;
    lightDir = [lx,ly];
  }
}
function checkLight(state) {
  if(state){
    canvas.addEventListener("mouseup", getLight, false);
    canvas.addEventListener("touchend", getLight, false);
    return false;
  }
  canvas.removeEventListener("mouseup", getLight, false);
  canvas.removeEventListener("touchend", getLight, false);
}
//////////////////////////////////////////////////////////////

function buildModelParamArray(model, trigger){
  let dati = {
    trigger:trigger,
    model:model,
    default_view: 1,
    viewside: presenter.getTrackballPosition().join(','),
    grid: $("#gridListValue").find('.active').val(),
    ortho: $("[name=ortho]").is(':checked') ? 1 : 0,
    xyz: $("[name=xyzAxes]").is(':checked') ? 1 : 0,
    lightDir: lightDir.join(','),
    texture: $("[name=texture]").is(':checked') ? 1 : 0,
    solid: $("[name=solid]").is(':checked') ? 1 : 0,
    lighting: $("[name=lighting]").is(':checked') ? 1 : 0,
    specular: $("[name=specular]").is(':checked') ? 1 : 0,
  }
  return dati;
}
function saveModelParam(dati){
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings)
  .done(function(data){
    if (data.res==0) {
      $("#toastDivError .errorOutput").text(data.msg);
      $("#toastDivError").removeClass("d-none");
    }else {
      $(".toastTitle").text(data.msg)
      closeToast.appendTo("#toastBtn").on('click', function(){
        $("#toastDivError, #toastDivSuccess, #toastDivContent").addClass("d-none");
        $("#toastBtn").html('');
      });
      $("#toastDivSuccess").removeClass("d-none")
    }
    $("#toastDivContent").removeClass('d-none')
  })
}