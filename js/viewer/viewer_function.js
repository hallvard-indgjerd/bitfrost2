$("[name=toggleViewSpot]").on('click', function(){
  $(this).find('span').toggleClass('mdi-chevron-down mdi-chevron-up');
})
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
// $("[name=addViewBtn]").on('click',addView)

/////////////////////////////////////////////////////////////
//////////////// FUNCTIONS //////////////////////////////////
/////////////////////////////////////////////////////////////

function initModel(model){
  console.log(model);
  let mainData = model.model;
  let object = model.model_object;
  let model_view = model.model_view;
  measure_unit = object[0].measure_unit;
  object.forEach((element, index) => {
    meshes['mesh_'+index] = {'url': 'archive/models/' + element.object }
    instances['mesh_'+index] = {
      mesh:'mesh_'+index, 
      tags: ['Group'], 
      color: [0.5, 0.5, 0.5], 
      backfaceColor: [0.5, 0.5, 0.5, 3.0], 
      specularColor: [0.0, 0.0, 0.0, 256.0]
    }
  });

  scene = {
    meshes: meshes, 
    modelInstances: instances, 
    trackball: trackBallOpt, 
    space: spaceOpt, 
    config: configOpt
  }

  init3dhop();

  presenter = new Presenter("draw-canvas");
  presenter.setScene(scene);
  // presenter._onEndMeasurement = onEndMeasure;
  // presenter._onEndPickingPoint = onEndPick;
  // presenter.setClippingPointXYZ(0.5, 0.5, 0.5);
  //light component
  // setupLightController()
  // resizeLightController()
  // updateLightController(lightDir[0],lightDir[1])
  // se vuoi disabilitare la visibilità dei piani di sezione
  // presenter.setClippingRendermode(false, presenter.getClippingRendermode()[1])

  switch (measure_unit) {
    case 'mm': gStep = 10.0; break;
    case 'm': gStep = 0.01; break;
    default: gStep = 1.0; break;
  }
  startupGrid(model_view.grid)
  
}
 
function resizeCanvas(){
  let w = $('#3dhop').parent().width()
  let h = $('#3dhop').parent().height();
  $('#draw-canvas').attr('width', w);
	$('#draw-canvas').attr('height',h);
	$('#3dhop').css('width', w);
	$('#3dhop').css('height', h);
  if(presenter) presenter.repaint();
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
      setInstructions("click the left mouse button and drag the cursor on model to change the light origin")
      sectionToolInit(false)
      measureSwitch(false);
      $("#lightCanvas-box").removeClass('invisible')
    break;
    case "light_off":
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