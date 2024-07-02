const artifactId = $("[name=artifactId]").val()
const activeUser = $("[name=activeUsr]").val()
const role = $("[name=role]").val()

// presenter object
var presenter = null;

// scene data
var sceneBB = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
var gStep, measure_unit;

// COLLECTION DATA
var COLLECTIONDATA = {};
var COLLECTIONITEM = undefined;

// VIEWER STATE
var DEFAULT_VIEWER_STATE = {
  grid : 'gridBase', //'none' 'gridBase' 'gridBox' 'gridBB'
  axes : false,
  //view
  navigation : "turntable", //turntable or sphere
  homeTrackState : [15,15,0,0,0,3.0],
  trackState : [15,15,0,0,0,3.0],
  fov : 40,
  ortho : false,
  //shading
  texture : true,
  transparent : false,
  specular : false,
  //lighting
  lighting : true,
  lightDir : [-0.17, 0.17], //initial lighting is top-left lighting
  //measurements
  activeMeasurement : null, //active measurement tool, can be null, or can be an object whose content depends on the tool
  //sections
  clipping : [false, false, false], //active x,y,z
  clippingDir : [1, 1, 1], //direction x,y,z
  clippingPoint : [0.5, 0.5, 0.5], //x,y,z
  clippingRender : [true, true], //render planes, render border
  //todo
};
var VIEWER_STATE = {};
var VIEWER_ANNOTATIONS = {
  type: "DC_SO_ANN",
  version: "2.0",
  object: artifactId,
  user: activeUser,
  time: new Date().toISOString(),
  notes: {text:""},
  views: {},
  spots: {}
};

// MEASUREMENT STATE-----------------------------------------------
let angleStage = 0;
let anglePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
let distanceStage = 0;
let distancePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0]];
let pickStage = 0;
let pickPoints = [[0.0,0.0,0.0]];
// SPOT PICKING STATE-----------------------------------------------
let spotPicking = false;
let spotPickingName = "";
let spotPoints = [];
//------------------------------------------------------------------

let paradata;

// interface: tooltips 
var toolBtnList = [].slice.call(document.querySelectorAll('.toolBtn'))
var tooltipBtnList = toolBtnList.map(function (tooltipBtn) { return new bootstrap.Tooltip(tooltipBtn,{trigger:'hover', html: true, placement:'left' })})

/////////////////////////////////////////////////////////////////////
////// handlers /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

//--HORIZONTAL TOOLBAR ON TOP---------------------------------------------
// home (reset all state), widescreen, screenshot, model info

$("#btHome").on('click', function(){
  setViewerState(null);
});

$("#btWidescreen").on('click', function(){
  resizeCanvas();
  $("#btWidescreen").toggleClass("btn-secondary").toggleClass("btn-adc-blue");
  $("#wrapAnnotations").toggleClass('invisible');
});

$("#btScreenshot").on('click', function(){screenshot();});

$("#paradata-modal").hide()
$("#btParadata").on('click', function(){
  if($("#paradata-modal").is(':hidden')){
    $("#paradata-modal").fadeIn('fast');
    $("#btParadata").removeClass("btn-secondary").addClass("btn-adc-blue");    
  }
  else{
    $("#paradata-modal").fadeOut('fast');
    $("#btParadata").removeClass("btn-adc-blue").addClass("btn-secondary");  
  }
})
$("[name=dismiss-paradata-modal]").on('click',function(){
  $("#paradata-modal").fadeOut('fast');
  $("#btParadata").removeClass("btn-adc-blue").addClass("btn-secondary");
})

//--RIGHT COMMAND PANEL---------------------------------------------

$("#btLighting").on('click', function(){
  setLighting();
});

$("#btTexture").on('click', function(){
  setTexture();
});
$("#btTransparency").on('click', function(){
  setTransparency();
});
$("#btSpecular").on('click', function(){
  setSpecular();
});

$("#btGrid").on('click', function(){
  setGrid();
});
$("#btAxes").on('click', function(){
  setAxes();
});

// cardinal views buttons
$(".btView").on('click', function(){
  viewFrom($(this).data('direction'))
})

$("#btOrtho").on('click', function(){
  setOrtho();
});

//--TOOLS---------------------------------------------
// measurement tools (3 buttons)
$(".measureTools").on('click', function(){
  let checked = $(this).is(':checked');
  stopMeasure();
  // calls a function named as the id of the clicked element, with the checked state as parameter
  window[$(this).prop('id')](checked);
})

// section tool
$(".sectionTool").on('click', function(){
    sectionToolShow($(this).is(':checked'));
})

//--LEFT ANNOTATION PANEL---------------------------------------------

//--ANNOTATIONS

//export / import annotations
$("#btExportAnnotations").on('click', function(){
  exportAnnotations();
});
$("#btImportAnnotations").on('click', function(){
  importAnnotations();
});
$("#ifileJSON").on('change', function(){
  getJSON(this.files);
});

//update notes
$("#annNotes").on('change', function(){
  updateNotes();
});

// store current view+state into views
$("#btAddView").on('click', function(){
  storeView();
});

// add new spot
$("#btAddSpot").on('click', function(){
  addSpot();
});





//------------------------------------------------------------------


$("#sectionReset").on('click',sectionReset)

$(".planeToggle").on('click', function(){
  let plane = $(this).prop('id').substring(0, 1);
  switch (plane) {
    case 'x':
      VIEWER_STATE.clipping[0] = !VIEWER_STATE.clipping[0];
    break;   
    case 'y':
      VIEWER_STATE.clipping[1] = !VIEWER_STATE.clipping[1];      
    break;  
    case 'z':
      VIEWER_STATE.clipping[2] = !VIEWER_STATE.clipping[2];
    break;
  }
  setSections();
})

$(".planeRange").on('input', function(){
  let plane = $(this).prop('id').substring(0, 1);
  let val = $(this).val();
  switch (plane) {
    case 'x':
      VIEWER_STATE.clipping[0] = true;
      VIEWER_STATE.clippingPoint[0] = val;
    break;
    case 'y':
      VIEWER_STATE.clipping[1] = true;
      VIEWER_STATE.clippingPoint[1] = val;
    break;
    case 'z':
      VIEWER_STATE.clipping[2] = true;
      VIEWER_STATE.clippingPoint[2] = val;
    break;
  }
  setSections();  
})

$(".planeFlip").on('click', function(){
  let plane = $(this).attr('id').substring(0, 1)
  let val = $(this).is(':checked') ? -1 : 1;
  switch (plane) {
    case 'x':
      VIEWER_STATE.clipping[0] = true;
      VIEWER_STATE.clippingDir[0] = val;
      break;
      case 'y':
        VIEWER_STATE.clipping[1] = true;
        VIEWER_STATE.clippingDir[1] = val;
      break;
      case 'z':
        VIEWER_STATE.clipping[2] = true;
        VIEWER_STATE.clippingDir[2] = val;
    break;
  }
  setSections();   
})

$("#showPlane").on('click', function(){
  VIEWER_STATE.clippingRender[0] = $(this).is(':checked');
  setSections();
})

$("#showBorder").on('click', function(){
  VIEWER_STATE.clippingRender[1] = $(this).is(':checked');
  setSections();  
})

// UUID COPY TO CLIPBOARD
$("#model-uuid").on('click', function(){copy_to_clipboard('model-uuid')})




/////////////////////////////////////////////////////////////
//////////////// FUNCTIONS //////////////////////////////////
/////////////////////////////////////////////////////////////

function changeModelStatus(model){
  let status = $("button[name=modelVisibility").val()
  let dati = {trigger:'changeModelStatus', dati:{id:model, status:status}}
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati;
  $.ajax(ajaxSettings)
    .done(function(data) {
      if (data.res==1) {
        $("#toastDivError .errorOutput").text(data.msg);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.msg)
        $("#toastDivSuccess").removeClass("d-none")
        setTimeout(function(){ location.reload(); }, 3000);
      }
      $("#toastDivContent").removeClass('d-none')
    })
}

function initModel(model){
  let mainData = model.model;
  const modelId = mainData.id;
  let object = model.model_object;
  let model_view = model.model_view;
  paradata = model.model_object[0]
  measure_unit = object[0].measure_unit;

  //fill modal metadata
  let statusAlert, statusTooltip, statusBtnClass, statusBtnValue, statusBtnTooltip;
  if(mainData.status_id == 1){
    statusAlert = 'alert-danger';
    statusTooltip = 'model not visible in the main gallery. Click the "change visibility" button or edit the model to change model visibility'
    statusBtnClass = 'btn-success'
    statusBtnValue = 2
    statusBtnTooltip = 'Mark model as complete. The Model will be visible in the main gallery'
  }else{
    statusAlert = 'alert-success';
    statusTooltip = 'model visible in the main gallery. Click the "change visibility" button or edit the model to change model visibility';
    statusBtnClass = 'btn-warning'
    statusBtnValue = 1
    statusBtnTooltip = 'Mark model as under processing. The Model will not be visible in the main gallery'
  }
  let modelStatus = $("#model-status").addClass(statusAlert)
  if(activeUser){
    modelStatus.tooltip({title:statusTooltip, placement:'top', trigger:'hover'});
    $("button[name=modelVisibility")
      .addClass(statusBtnClass)
      .val(statusBtnValue)
      .tooltip({title:statusBtnTooltip, placement:'top', trigger:'hover'})
      .on('click',function(){changeModelStatus(modelId)})
  }else{
    $("#toolBarModel").remove()
  } 
  Object.keys(mainData).forEach(function(key) {
    if(mainData[key]){
      if(key == 'doi' && mainData.doi){
        let doi = $("#model-doi")
        doi.attr('href',mainData.doi)
        $("<img/>",{src:mainData.doi_svg}).appendTo(doi)

        let btn = $("<a/>",{class:'btn btn-light', href:mainData.doi, target:'_blank', title:'view on Zenodo'}).text(' DOI').appendTo('#itemToolLastDiv').tooltip();
        $("<i/>",{class:'mdi mdi-share-variant-outline'}).prependTo(btn)
      }else{
        $("#model-"+key).text(mainData[key])
        $("#model-"+key).text(mainData[key])
      }
    }
    if(!mainData[key] && !role){
      if(key == 'doi'){$("#doiItem").remove()}
      $("#model-"+key).parent().remove()
    }
  })
  
  object.forEach((element, index) => {
    let thumbPath = 'archive/thumb/'+element.thumbnail;
    let thumbDiv = $("<div/>",{'class':'thumb'}).appendTo('#object-control');
    $("<img/>",{class:'img-fluid', src:thumbPath}).appendTo(thumbDiv)
    // thumbDiv.css("background-image","url("+thumbPath+")");
    let backdrop = $("<div/>",{'class':'backdrop'}).appendTo(thumbDiv).hide();
    thumbDiv.on('click', function(){
      backdrop.toggle()
      let vis = backdrop.is(':visible') ? false : true;
      presenter.setInstanceVisibilityByName('mesh_'+index, vis, true)
    })

    let row = $("<div/>",{'class':'row'}).appendTo("#listWrap");
    let thumb = $("<div/>",{'class':'col-4'}).appendTo(row)
    $("<img/>",{'class':'img-fluid rounded', 'src':thumbPath}).appendTo(thumb)
    let metadata = $("<div/>",{'class':'col-8'}).appendTo(row)
    let ul = $("<ul/>",{'class':'list-group list-group-flush'}).appendTo(metadata)

    let field = ['acquisition_method','status','author','owner','license_acronym','create_at','description','note','software','points','polygons','textures','scans','pictures','encumbrance','measure_unit']
    Object.keys(element).forEach((key)=>{
      if (field.includes(key)){
        if(element[key]){
          let li = $("<li/>",{'class':'list-group-item'}).appendTo(ul)
          $("<span/>").text(key).appendTo(li)
          $("<span/>").text(element[key]).appendTo(li)
        }
      }
    })
    if(activeUser){
      let navBarObj = $("<nav/>",{class:"my-3 pb-2 border-bottom"}).appendTo(metadata);
      $("<a/>",{href:'object_edit.php?model='+mainData.id+'&item='+element.id, class:'btn btn-sm btn-adc-dark', text:'edit'}).appendTo(navBarObj)
      if(object.length > 1){
        $("<button/>",{type:'button', class:'btn btn-sm btn-danger float-end', text:'delete object'}).appendTo(navBarObj)
      }
    }
  });

  // retrieve collectiond ata from LocalStorage
  COLLECTIONDATA = JSON.parse(localStorage.getItem('DYNCOLLECTION')) || {};
  COLLECTIONITEM = COLLECTIONDATA.items.find((item) => item.id == artifactId);
  if(COLLECTIONITEM){
    //retrieve annotations, if present
    if(COLLECTIONITEM.annotations){
      VIEWER_ANNOTATIONS = COLLECTIONITEM.annotations;
      // but I cannot display them now, because the viewewr is not yet initialized. I'll schedule it at the end of the startupViewer function
    }
  }
  startupViewer(object);
}

function startupViewer(object){
  // init 3dhop environment
  init3dhop();
  // create viewer in canvas
  presenter = new Presenter("draw-canvas");

  // set viewer state to default values
  defaultViewerState();

  // initial scene setup
	var myScene = {
		meshes: { // default models used for utilities
			"sphere" : { url: "archive/models/sphere.ply" },  
			"cube"   : { url: "archive/models/cube.ply" },
		},
		modelInstances: { //still empty
		},
		spots: { //still empty
		},
		trackball: { // default trackball settings, will be overwritten by the state
		},
		space: {
			centerMode: "scene",
			radiusMode: "scene",
			cameraNearFar: [0.01, 10.0],
      cameraFOV: DEFAULT_VIEWER_STATE.fov,
		},
		config: {
			pickedpointColor    : [1.0, 0.0, 1.0],
			measurementColor    : [0.5, 1.0, 0.5],
			showClippingPlanes  : true,
			showClippingBorder  : true,
			clippingBorderSize  : 0.1,
			clippingBorderColor : [0.0, 1.0, 1.0]
		}
	};

  if(DEFAULT_VIEWER_STATE.navigation == "turntable"){
    myScene.trackball = {
      type: TurntablePanTrackball,
      trackOptions: {
        startPhi: DEFAULT_VIEWER_STATE.trackState[0],
        startTheta: DEFAULT_VIEWER_STATE.trackState[1],
        startPanX: DEFAULT_VIEWER_STATE.trackState[2],
        startPanY: DEFAULT_VIEWER_STATE.trackState[3],
        startPanZ: DEFAULT_VIEWER_STATE.trackState[4],
        startDistance: DEFAULT_VIEWER_STATE.trackState[5],
        minMaxPhi: [-180, 180],
        minMaxTheta: [-90.0, 90.0],
        minMaxDist: [0.1, 5.0]
      }
    };
  }
  else if(DEFAULT_VIEWER_STATE.navigation == "sphere"){
    myScene.trackball = {
      type: SphereTrackball,
      trackOptions: {
        startMatrix   : [ 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0 ],
        startPanX     : 0.0,
        startPanY     : 0.0,
        startPanZ     : 0.0,
        startDistance : 2.0,
        minMaxDist    : [0.2, 4.0],
      }
    };
  }

  // populate meshes and instances
  object.forEach((element, index) => {
    myScene.meshes['mesh_'+index] = {
      'url': 'archive/models/' + element.object 
    };
    myScene.modelInstances['mesh_'+index] = {
      mesh:'mesh_'+index, 
      tags: ['Group'], 
      color: [0.5, 0.5, 0.5], 
      backfaceColor: [0.5, 0.5, 0.5, 3.0], 
      specularColor: [0.0, 0.0, 0.0, 256.0]
    };
  });

  // update clipping border according to measure unit
	if(measure_unit === "mm")
		myScene.config.clippingBorderSize = 0.5;
	if(measure_unit === "m")
		myScene.config.clippingBorderSize = 0.0005;

  presenter.setScene(myScene);

  // handlers
  presenter._onEndMeasurement = onEndMeasure;
  presenter._onEndPickingPoint = onEndPick;

  // reset sections
  presenter.setClippingPointXYZ(0.5, 0.5, 0.5);

  //light controller
  initLightController(VIEWER_STATE.lightDir[0],VIEWER_STATE.lightDir[1]);

  switch (measure_unit) {
    case 'mm': gStep = 10.0; break;
    case 'm': gStep = 0.01; break;
    default: gStep = 1.0; break;
  }
  
  startupGrid(VIEWER_STATE.grid);
  startupAnnotations(); // display annotations loaded from localstorage
}

function startupAnnotations(){ // display annotations loaded from localstorage
  if(!presenter._isSceneReady()){
    setTimeout(function(){startupAnnotations()},50);
    return;
  }
  displayNotes();
  displayViews();
  displaySpots();
}

////// VIEWERSTATE MANAGEMENT //////////////////////////////////////

function defaultViewerState(){
  // copy default state to viewer state
  VIEWER_STATE = JSON.parse(JSON.stringify(DEFAULT_VIEWER_STATE));  // ideally, it should use structuredClone(value), but it is still not fully supported in all browsers
}

// set viewer to a specific state, if none, resets to the default state
function setViewerState(viewerState){
  if(viewerState)
    VIEWER_STATE = JSON.parse(JSON.stringify(viewerState));  // ideally, it should use structuredClone(value), but it is still not fully supported in all browsers  
  else
    defaultViewerState(); // if no state is passed, reset to default values

  presenter.animateToTrackballPosition(VIEWER_STATE.trackState);
  setOrtho(VIEWER_STATE.ortho);

  setLighting(VIEWER_STATE.lighting, VIEWER_STATE.lightDir);

  setTexture(VIEWER_STATE.texture);
  setTransparency(VIEWER_STATE.transparent);
  setSpecular(VIEWER_STATE.specular);

  setGrid(VIEWER_STATE.grid);
  setAxes(VIEWER_STATE.axes);

  setSections();

  //active measurement tool
  if(VIEWER_STATE.activeMeasurement){
    measureDistance(false);
    measurePickpoint(false);
    measureAngle(false);
    $(".measureTools").prop('checked', false);

    let type = VIEWER_STATE.activeMeasurement.type;
    if(type == 'distance'){
      distanceTool(true);
      distanceStage = 2;
      distancePoints[0] = VIEWER_STATE.activeMeasurement.p0.slice();
      distancePoints[1] = VIEWER_STATE.activeMeasurement.p1.slice();
      computeDistance();
		  presenter.repaint();
    }
    if(type == 'pick'){
      pickTool(true);
      pickStage = 1;
      pickPoints[0] = VIEWER_STATE.activeMeasurement.p0.slice();
      computePickpoint();
		  presenter.repaint();
    }
    if(type == 'angle'){
      angleTool(true);
      angleStage = 3;
      anglePoints[0] = VIEWER_STATE.activeMeasurement.p0.slice();
      anglePoints[1] = VIEWER_STATE.activeMeasurement.p1.slice();
      anglePoints[2] = VIEWER_STATE.activeMeasurement.p2.slice();
      computeAngle();
      presenter.repaint();      
    }
  }
  else{
    stopMeasure();
  }

  presenter.repaint();
}

///////////////// SET VIEWERSTATUS VALUE AND APPLY CHANGES //////////////////////
// if no value is passed, toggle/cycle the state

// lighting and light direction
function setLighting(value, lightdir){
  VIEWER_STATE.lighting = (value !== undefined) ? value : !VIEWER_STATE.lighting;
  presenter.enableSceneLighting(VIEWER_STATE.lighting);
  $("#btLighting").removeClass(VIEWER_STATE.lighting? "btn-secondary" : "btn-adc-blue").addClass(VIEWER_STATE.lighting? "btn-adc-blue" : "btn-secondary");
  if(lightdir !== undefined){
    VIEWER_STATE.lightDir = lightdir;
  }
  updateLightController(VIEWER_STATE.lightDir[0],VIEWER_STATE.lightDir[1]);
  presenter.rotateLight(VIEWER_STATE.lightDir[0],VIEWER_STATE.lightDir[1]);
}

// texture-solidcolor
function setTexture(value){
  VIEWER_STATE.texture = (value !== undefined) ? value : !VIEWER_STATE.texture;
  presenter.setInstanceSolidColor('Group', !VIEWER_STATE.texture, true);
  $("#btTexture").removeClass(VIEWER_STATE.texture? "btn-secondary" : "btn-adc-blue").addClass(VIEWER_STATE.texture? "btn-adc-blue" : "btn-secondary");
}

// transparent-solid
function setTransparency(value){
  VIEWER_STATE.transparent = (value !== undefined) ? value : !VIEWER_STATE.transparent;
  presenter.setInstanceTransparency('Group', VIEWER_STATE.transparent, true);
  $("#btTransparency").removeClass(VIEWER_STATE.transparent? "btn-secondary" : "btn-adc-blue").addClass(VIEWER_STATE.transparent? "btn-adc-blue" : "btn-secondary");
}

// lambertian-specular
function setSpecular(value){
  VIEWER_STATE.specular = (value !== undefined) ? value : !VIEWER_STATE.specular;
  let spec = VIEWER_STATE.specular ? [0.3,0.3,0.3,256.0] : [0.0,0.0,0.0,256.0];
  for (inst in presenter._scene.modelInstances){
    presenter._scene.modelInstances[inst].specularColor = spec;
  }
  presenter.repaint();
  $("#btSpecular").removeClass(VIEWER_STATE.specular? "btn-secondary" : "btn-adc-blue").addClass(VIEWER_STATE.specular? "btn-adc-blue" : "btn-secondary");
}

// orhtographic view
function setOrtho(value){
  VIEWER_STATE.ortho = (value !== undefined) ? value : !VIEWER_STATE.ortho;
  VIEWER_STATE.ortho ? presenter.setCameraOrthographic() : presenter.setCameraPerspective();
  $("#btOrtho").removeClass(VIEWER_STATE.ortho? "btn-secondary" : "btn-adc-blue").addClass(VIEWER_STATE.ortho? "btn-adc-blue" : "btn-secondary");
}

// reference axes
function setAxes(value){
  VIEWER_STATE.axes = (value !== undefined)? value : !VIEWER_STATE.axes;
  VIEWER_STATE.axes ? addAxes() : removeAxes();
  $("#btAxes").removeClass(VIEWER_STATE.axes? "btn-secondary" : "btn-adc-blue").addClass(VIEWER_STATE.axes? "btn-adc-blue" : "btn-secondary");
}

function setGrid(value){
  //available grid options: 'none' 'gridBase' 'gridBox' 'gridBB'
  //delete current grid, but I do not know which one is active, so I delete all possible grids
  presenter.deleteEntity('gridBase');
  presenter.deleteEntity('gridBox');
  presenter.deleteEntity('gridBB'); 
  $("#btGrid").removeClass("btn-adc-blue btn-secondary");

  if(value !== undefined)
    VIEWER_STATE.grid = value;
  else{
    switch (VIEWER_STATE.grid) {  // cycles through grid options
      case 'none': VIEWER_STATE.grid = 'gridBase'; break;      
      case 'gridBase': VIEWER_STATE.grid = 'gridBox'; break;
      case 'gridBox': VIEWER_STATE.grid = 'gridBB'; break;
      case 'gridBB':  VIEWER_STATE.grid = 'none'; break;
    }
  }

  switch (VIEWER_STATE.grid) {  // cycles through grid options
    case 'none':
      $("#btGrid").addClass("btn-secondary");
      break;
    case 'gridBase':
      addBaseGrid();
      $("#btGrid").addClass("btn-adc-blue");
      break;
    case 'gridBox':
      addBoxGrid();
      $("#btGrid").addClass("btn-adc-blue");      
      break;
    case 'gridBB':
      addBBGrid();
      $("#btGrid").addClass("btn-adc-blue");      
      break;
  }    
  presenter.repaint();
}
///////////////// SET VIEWERSTATUS VALUES AND APPLY CHANGES - END //////////////////////


//////////////////////////////// ANNOTATIONS //////////////////////////////////////

function validateAnnotations(annotations){
  if (annotations.type !== "DC_SO_ANN") return false;
  return true;
}

function exportAnnotations(){
  VIEWER_ANNOTATIONS.time = new Date().toISOString(); // update time to current time
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(VIEWER_ANNOTATIONS, null, 2)));
	element.setAttribute('download', "annotations.json");
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
function importAnnotations(){
	document.getElementById("ifileJSON").click();
}
function getJSON(files){
	if((files)&&(files.length>0)){
	    var reader = new FileReader();
		reader.onload = importJSON;
		reader.readAsText(files[0]);
	}
}
function importJSON(event){
  var newAnn = JSON.parse(event.target.result);
	//console.log(newAnn); //DEBUG DEBUG DEBUG
  if(newAnn.object != VIEWER_ANNOTATIONS.object){
    alert('Object mismatch! cannot import annotations');
    return;
  }
  
  VIEWER_ANNOTATIONS = newAnn;
  displayNotes();
  displayViews();
  displaySpots();
  presenter.repaint();

  VIEWER_ANNOTATIONS.user = activeUser; //no matter who saved them, they are now of the current user
}

function updateNotes(){
	VIEWER_ANNOTATIONS.notes.text = document.getElementById("annNotes").value;
  storeAnnotations();
}
function displayNotes(){
  document.getElementById("annNotes").value = VIEWER_ANNOTATIONS.notes.text;
}

function storeView(){
  // get first free index
  let viewIndex = 100;
  while( VIEWER_ANNOTATIONS.views["V"+viewIndex]){ viewIndex++; }
  let viewName = "V"+viewIndex;

  VIEWER_ANNOTATIONS.views[viewName] = {};
  VIEWER_ANNOTATIONS.views[viewName].view = null;
  VIEWER_ANNOTATIONS.views[viewName].state = JSON.parse(JSON.stringify(VIEWER_STATE));  // ideally, it should use structuredClone(value), but it is still not fully supported in all browsers
  VIEWER_ANNOTATIONS.views[viewName].text = "";
  VIEWER_ANNOTATIONS.views[viewName].url = "";

  displayViews(); // update views list
  storeAnnotations();
}
function displayViews(){
  let listDiv = $("#viewsListDiv");

  let content = "";
  content += "<ul class='list-group'>";
  for (view in VIEWER_ANNOTATIONS.views){
    content += "<li class='list-group-item'>";
    content += "<i>"+view+"</i> ";    
    content += "<textarea rows='3' style='width:100%;' placeholder='...' onchange='updateViewText(\""+view+"\",this.value);'>" + VIEWER_ANNOTATIONS.views[view].text + "</textarea>";
    content += "<button type='button' class='btn btn-secondary mx-1 btGoView' data-viewName='"+view+"' onclick='applyView(\""+view+"\")'><span class='mdi mdi-directions'></span></button>";    
    content += "<button type='button' class='btn  btn-sm btn-secondary mx-1 btEditView' data-viewName='"+view+"' onclick='updateViewState(\""+view+"\")'><span class='mdi mdi-tooltip-edit'></span></button>";
    content += "<button type='button' class='btn  btn-sm btn-danger mx-1 btDelView' data-viewName='"+view+"' onclick='deleteView(\""+view+"\")'><span class='mdi mdi-delete-forever'></span></button>";
    content += "</li>";
  }
  content += "</ul>";

  listDiv.html(content);
}
function applyView(viewName){
  setViewerState(VIEWER_ANNOTATIONS.views[viewName].state);
}
function updateViewState(viewName){
  VIEWER_ANNOTATIONS.views[viewName].state = JSON.parse(JSON.stringify(VIEWER_STATE));  // ideally, it should use structuredClone(value), but it is still not fully supported in all browsers
  storeAnnotations();
}
function updateViewText(viewName, value){
  VIEWER_ANNOTATIONS.views[viewName].text = value;
  storeAnnotations();
}
function deleteView(viewName){
  if(confirm('A view is being deleted, are you sure?')){
    delete VIEWER_ANNOTATIONS.views[viewName];
    displayViews(); // update views list
    storeAnnotations();
  }
}

function addSpot(){
  if (spotPicking) return;  //already in spot picking mode
  stopMeasure();
  spotPicking = true;
  // get first free index
  let spotIndex = 100;
  while( VIEWER_ANNOTATIONS.spots["S"+spotIndex]){ spotIndex++; }
  spotPickingName = "S"+spotIndex;
  $('#draw-canvas').css("cursor","crosshair");
  presenter._onEndPickingPoint = onSpotPick;
  presenter.enablePickpointMode(true);
}
function onSpotPick(point){ 
  VIEWER_ANNOTATIONS.spots[spotPickingName] = {};
  VIEWER_ANNOTATIONS.spots[spotPickingName].point = point;
  VIEWER_ANNOTATIONS.spots[spotPickingName].text = "";
  VIEWER_ANNOTATIONS.spots[spotPickingName].url = "";
  spotPickEnd(); // stop spot picking mode
  displaySpots(); // update spots list
  storeAnnotations();
}
function spotPickEnd(){
  $('#draw-canvas').css("cursor","default");
  presenter.enablePickpointMode(false);
  spotPicking = false;
  spotPickingName = "";
  spotPoints = [];
}
function displaySpots(){
  let listDiv = $("#spotsListDiv");
  let content = "";
  content += "<ul class='list-group'>";
  for (spot in VIEWER_ANNOTATIONS.spots){
    content += "<li class='list-group-item'>";
    content += "<i>"+spot+"</i> - ";
    var clampTo = (measure_unit == "m")? 3 : 2;
    content += "["+VIEWER_ANNOTATIONS.spots[spot].point[0].toFixed(clampTo)+", "+VIEWER_ANNOTATIONS.spots[spot].point[1].toFixed(clampTo)+", "+VIEWER_ANNOTATIONS.spots[spot].point[2].toFixed(clampTo)+"]";
    content += "<textarea rows='2' style='width:100%;' placeholder='...' onchange='updateSpotText(\""+spot+"\",this.value);'>" + VIEWER_ANNOTATIONS.spots[spot].text + "</textarea>";
    content += "<button type='button' class='btn btn-sm btn-danger mx-1 btDelView' data-viewName='"+spot+"' onclick='deleteSpot(\""+spot+"\")'><span class='mdi mdi-delete-forever'></span></button>";
    content += "</li>";
  }
  content += "</ul>";
  listDiv.html(content);

  if(!presenter._scene) return;
	presenter._scene.spots = {};
	presenter._spotsProgressiveID = 10;	// reset to avoid accumulation

  for (spot in VIEWER_ANNOTATIONS.spots){
    var radius = 2.5;

		// place according to current object transform
		var opoint = [VIEWER_ANNOTATIONS.spots[spot].point[0], VIEWER_ANNOTATIONS.spots[spot].point[1], VIEWER_ANNOTATIONS.spots[spot].point[2], 1.0];
		var tpoint = SglMat4.mul4(presenter._scene.modelInstances["mesh_0"].transform.matrix, opoint);

    var newSpot = {
			mesh            : "sphere",
			color           : [1.0, 0.0, 1.0],//VIEWER_ANNOTATIONS.spots[spot].color,
			alpha           : 0.7,
			transform : { 
				translation : [tpoint[0],tpoint[1],tpoint[2]],
				scale : [radius, radius, radius],
				},
			visible         : true, //VIEWER_ANNOTATIONS.spots[spot].visible,
		};
		presenter._scene.spots[spot] = presenter._parseSpot(newSpot);	
		presenter._scene.spots[spot].rendermode = "FILL";  //maybe this is not necessary
  }  
	presenter.repaint();
  /*
	presenter.enableOnHover(true);
	presenter._onEnterSpot = onESpot;
	presenter._onLeaveSpot = onLSpot;	
*/
}
function updateSpotText(spotName, value){
  VIEWER_ANNOTATIONS.spots[spotName].text = value;
  storeAnnotations();
}
function deleteSpot(spotName){
  if(confirm('A spot is being deleted, are you sure?')){
    delete VIEWER_ANNOTATIONS.spots[spotName];
    displaySpots();
    storeAnnotations();      
  }
} 
//////////////////////////////// ANNOTATIONS END //////////////////////////////////////

function storeAnnotations(){
  if(COLLECTIONITEM){
    VIEWER_ANNOTATIONS.time = new Date().toISOString(); // update time to current time
    COLLECTIONITEM.annotations = VIEWER_ANNOTATIONS;
    storeCollectionData();
  }
}

function storeCollectionData(){
  localStorage.setItem('DYNCOLLECTION', JSON.stringify(COLLECTIONDATA));
}


//--------------------------------------------------------------------------------------
function screenshot() {
  presenter.saveScreenshot();
}
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
function viewFrom(direction){
	var distance = DEFAULT_VIEWER_STATE.homeTrackState[5];
    switch(direction) {
        case "default":
          presenter.animateToTrackballPosition(DEFAULT_VIEWER_STATE.homeTrackState);
        break;
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
//--------------------------------------------------------------------------------------

// MEASUREMENT TOOLS START STOP---------------------------------------------------------
function distanceTool(state){
  if(state){
    $("#distanceTool").prop('checked', true);
    measureDistance(true);
    measurePanelSwitch(true, "Pick two points A-B on the object to measure their distance", "Measured length", "0.00 "+measure_unit);
  }
  else{
    $("#distanceTool").prop('checked', false);
    measureDistance(false);
    measurePanelSwitch(false);
  }
}

function pickTool(state){
  if(state){
    $("#pickTool").prop('checked', true);        
    measurePickpoint(true);
    measurePanelSwitch(true, "pick a point A on the object to read its coordinates", "Picked point", "[ 0 , 0 , 0 ]");
  }
  else{
    $("#pickTool").prop('checked', false);        
    measurePickpoint(false);
    measurePanelSwitch(false);
  }
}

function angleTool(state){
  if(state){
    $("#angleTool").prop('checked', true);
    measureAngle(true);
    measurePanelSwitch(true, "pick three points A-O-B on the object to measure the angle A&Ocirc;B", "Angle measurement", "0°");
  }
  else{
    $("#angleTool").prop('checked', false);
    measureAngle(false);
    measurePanelSwitch(false);
  }
}

function stopMeasure(){
  $(".measureTools").prop('checked', false);  
  measureDistance(false);
  measurePickpoint(false);
  measureAngle(false);
  measurePanelSwitch(false);
  VIEWER_STATE.activeMeasurement = null;
}

function measurePanelSwitch(state, instructions, title, output) {
  if(instructions) $('#panel_instructions').html(instructions); 
  if(title) $("#measure-box-title").text(title);
  if(output) $("#measure-output").text(output);

  if(state){
    $('#measure-box').removeClass('invisible').fadeIn('fast');
    $('#draw-canvas').css("cursor","crosshair");
  }else{
    $('#measure-box').addClass('invisible');
    $('#draw-canvas').css("cursor","default");
  }
}

//--------------------------------------------------------------------------------------

function addAxes(){
	var rad = (1.0 / presenter.sceneRadiusInv)/2.0;
	var linesBuffer;
	var point, tpoint;
	// WARNING. I assume there is always a mesh_0 in the scene
	point = [rad, 0.0, 0.0, 1.0]
	tpoint = SglMat4.mul4(presenter._scene.modelInstances["mesh_0"].transform.matrix, point);
	linesBuffer = [];
	linesBuffer.push([0, 0, 0]);
	linesBuffer.push([tpoint[0], tpoint[1], tpoint[2]]);	
	var axisX = presenter.createEntity("XXaxis", "lines", linesBuffer);
	axisX.color = [1.0, 0.2, 0.2, 1.0];
	axisX.zOff = 0.0;
	
	point = [0.0, rad, 0.0, 1.0]
	tpoint = SglMat4.mul4(presenter._scene.modelInstances["mesh_0"].transform.matrix, point);
	linesBuffer = [];
	linesBuffer.push([0, 0, 0]);
	linesBuffer.push([tpoint[0], tpoint[1], tpoint[2]]);	
	var axisY = presenter.createEntity("YYaxis", "lines", linesBuffer);
	axisY.color = [0.2, 1.0, 0.2, 1.0];
	axisY.zOff = 0.0;

	point = [0.0, 0.0, rad, 1.0]
	tpoint = SglMat4.mul4(presenter._scene.modelInstances["mesh_0"].transform.matrix, point);	
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
  //computeEncumbrance(); //not used yet
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

function computeEncumbrance() {
  computeSceneBB();
  var encumbrance = [0.0, 0.0, 0.0];
  encumbrance[0] = Math.trunc(Math.ceil((sceneBB[0]-sceneBB[3])/gStep)+1);
  encumbrance[1] = Math.trunc(Math.ceil((sceneBB[1]-sceneBB[4])/gStep)+1);
  encumbrance[2] = Math.trunc(Math.ceil((sceneBB[2]-sceneBB[5])/gStep)+1);
  //I should store encumbrance somewhere :)
  //el('encumbrance').value = encumbrance[0] + " x " + encumbrance[1]  + " x " + encumbrance[2] + " cm";
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

//---------------------------------------------------------------------------------------
function onTrackballUpdate(trackState){
  VIEWER_STATE.trackState = trackState; // store trackball state in current state
	//updateCube(-trackState[0], -trackState[1]);
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



function onEndMeasure(measure, p0, p1) {
	var clampTo = (measure_unit == "m")? 3 : 2;
	$('#measure-output').html(measure.toFixed(clampTo) + measure_unit);
  //sets active measurment in the viewer state
  VIEWER_STATE.activeMeasurement = {};
  VIEWER_STATE.activeMeasurement.type = "distance";
  VIEWER_STATE.activeMeasurement.value = measure;
  VIEWER_STATE.activeMeasurement.p0 = p0.slice();
  VIEWER_STATE.activeMeasurement.p1 = p1.slice();
}

function onEndPick(point) {
	var clampTo = (measure_unit == "m")? 3 : 2;
	//undo object transform
	var opoint = [point[0], point[1], point[2], 1.0];	
	var tpoint = SglMat4.mul4(SglMat4.inverse(presenter._scene.modelInstances["mesh_0"].transform.matrix), opoint);
	var x = tpoint[0].toFixed(clampTo);
	var y = tpoint[1].toFixed(clampTo);
	var z = tpoint[2].toFixed(clampTo);
  $('#measure-output').html("[ "+x+" , "+y+" , "+z+" ]");
  //sets active measurment in the viewer state
  VIEWER_STATE.activeMeasurement = {};
  VIEWER_STATE.activeMeasurement.type = "pick";
  VIEWER_STATE.activeMeasurement.p0 = point.slice();
}


// pickpoint measurement functions
function measurePickpoint(state){
  pickStage = 0;
  pickPoints = [0.0,0.0,0.0];
  if(state){
    presenter._onEndPickingPoint = onPickpointPick;
    presenter.enablePickpointMode(true);
  }else{
    presenter.deleteEntity("pickpointP");
    presenter.deleteEntity("pickpointL");    
    presenter.enablePickpointMode(false);
    presenter._onEndPickingPoint = onEndPick;    
  }
}
function onPickpointPick(point) {
  if(pickStage == 1){ pickStage = 0; }//reset for new measure
  pickPoints[pickStage] = [point[0],point[1],point[2]];
  presenter._pickValid=false;
  computePickpoint();
}
function computePickpoint(){ 
  var opoint = [pickPoints[0][0], pickPoints[0][1], pickPoints[0][2], 1.0];	
  var tpoint = SglMat4.mul4(SglMat4.inverse(presenter._scene.modelInstances["mesh_0"].transform.matrix), opoint);
	var clampTo = (measure_unit == "m")? 3 : 2;   
	var x = tpoint[0].toFixed(clampTo);
	var y = tpoint[1].toFixed(clampTo);
	var z = tpoint[2].toFixed(clampTo);
  $('#measure-output').html("[ "+x+" , "+y+" , "+z+" ]");
  //sets active measurment in the viewer state
  VIEWER_STATE.activeMeasurement = {};
  VIEWER_STATE.activeMeasurement.type = "pick";
  VIEWER_STATE.activeMeasurement.p0 = pickPoints[0].slice();  
  displayPickpoint();
}
function displayPickpoint(){
	var pointsBuffer = [];
	var linesBuffer = [];
	  
	pointsBuffer.push(pickPoints[0]);
	var pickpointP = presenter.createEntity("pickpointP", "points", pointsBuffer);
	pickpointP.color = [0.8, 0.3, 0.7, 1.0];
  pickpointP.pointSize = 10;
  pickpointP.useSeethrough = true;

  linesBuffer.push(SglVec3.add(pickPoints[0], [ 5.0, 0.0, 0.0]));
  linesBuffer.push(SglVec3.add(pickPoints[0], [-5.0, 0.0, 0.0]));  
  linesBuffer.push(SglVec3.add(pickPoints[0], [ 0.0, 5.0, 0.0]));
  linesBuffer.push(SglVec3.add(pickPoints[0], [ 0.0,-5.0, 0.0]));
  linesBuffer.push(SglVec3.add(pickPoints[0], [ 0.0, 0.0, 5.0]));
  linesBuffer.push(SglVec3.add(pickPoints[0], [ 0.0, 0.0,-5.0]));
  var pickpointL = presenter.createEntity("pickpointL", "lines", linesBuffer);
  pickpointL.color = [0.8, 0.3, 0.7, 1.0];
  pickpointL.zOff = 0.0;

  presenter.repaint();
}

// distence measurement functions
function measureDistance(state){
  distanceStage = 0;
  distancePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0]];
  if(state){
    presenter._onEndPickingPoint = onDistancePick;
    presenter.enablePickpointMode(true);
  }else{
    presenter.deleteEntity("distanceP");
    presenter.deleteEntity("distanceL");
    presenter.enablePickpointMode(false);
    presenter._onEndPickingPoint = onEndPick;
  }
}
function onDistancePick(point) {
  if(distanceStage == 2){ distanceStage = 0; }//reset for new measure
  distancePoints[distanceStage] = [point[0],point[1],point[2]];
  distanceStage++;
  displayDistance();
  presenter._pickValid=false;
  if(distanceStage == 2){computeDistance();}
}
function computeDistance(){
  var distance = SglVec3.length(SglVec3.sub(distancePoints[0], distancePoints[1]));
  var clampTo = (measure_unit == "m")? 3 : 2;
  $('#measure-output').html(distance.toFixed(clampTo) + measure_unit);
  //display distance 
  displayDistance();
  //sets active measurment in the viewer state
  VIEWER_STATE.activeMeasurement = {};
  VIEWER_STATE.activeMeasurement.type = "distance";
  VIEWER_STATE.activeMeasurement.value = distance;
  VIEWER_STATE.activeMeasurement.p0 = distancePoints[0].slice();
  VIEWER_STATE.activeMeasurement.p1 = distancePoints[1].slice();
}
function displayDistance(){
	var pointsBuffer = [];
	for(ii=0; ii<distanceStage; ii++){
		pointsBuffer.push(distancePoints[ii]);
	}
	var angleP = presenter.createEntity("distanceP", "points", pointsBuffer);
	angleP.color = [0.5, 1.0, 0.5, 1.0];
  angleP.pointSize = 10;
  angleP.useSeethrough = true;

  if(distanceStage == 2){
    var distance = SglVec3.length(SglVec3.sub(distancePoints[0], distancePoints[1]));
    var thickness = Math.min((measure_unit == "mm")? 0.25 : 0.25/1000.0, distance/20.0);
    var triBuffer = tube(distancePoints[0], distancePoints[1], thickness);
    var distanceBar = presenter.createEntity("distanceL", "triangleStrip", triBuffer);
    distanceBar.color = [0.5, 1.0, 0.5, 1.0];
    distanceBar.useTransparency = false;
    distanceBar.useSeethrough = true;
    distanceBar.zOff = 0.0;
    presenter.repaint();
  }
}

// angle measurement functions
function measureAngle(state){
	angleStage = 0;
	anglePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
	if(state){
		presenter._onEndPickingPoint = onAnglePick;
		presenter.enablePickpointMode(true);	
	}else{
		presenter.deleteEntity("angleP");
		presenter.deleteEntity("angleL");
		presenter.deleteEntity("angleV");
		presenter.enablePickpointMode(false);
		presenter._onEndPickingPoint = onEndPick;
	}
}
function onAnglePick(point) {
	if(angleStage == 3){ angleStage = 0; }//reset for new measure
	anglePoints[angleStage] = [point[0],point[1],point[2]];
	angleStage++;
	displayAngle();
  presenter._pickValid=false;  
	if(angleStage == 3){
    computeAngle();
  }
}
function computeAngle(){
	var v1 = SglVec3.normalize(SglVec3.sub(anglePoints[0], anglePoints[1]));
	var v2 = SglVec3.normalize(SglVec3.sub(anglePoints[2], anglePoints[1]));
	var angle = sglRadToDeg(Math.acos(SglVec3.dot(v1,v2)));
	$('#measure-output').html(angle.toFixed(2) + "&deg;");
  //display angle
  displayAngle();
  //sets active measurment in the viewer state
  VIEWER_STATE.activeMeasurement = {};
  VIEWER_STATE.activeMeasurement.type = "angle";
  VIEWER_STATE.activeMeasurement.angle = angle;
  VIEWER_STATE.activeMeasurement.p0 = anglePoints[0].slice();
  VIEWER_STATE.activeMeasurement.p1 = anglePoints[1].slice();
  VIEWER_STATE.activeMeasurement.p2 = anglePoints[2].slice();
}
function displayAngle(){
	var pointsBuffer = [];
	for(ii=0; ii<angleStage; ii++){
		pointsBuffer.push(anglePoints[ii]);
	}
	var angleP = presenter.createEntity("angleP", "points", pointsBuffer);
	angleP.color = [0.2, 0.3, 0.9, 1.0];
  angleP.pointSize = 8;
  angleP.useSeethrough = true;

  var linesBuffer = [];
  for(ii=0; ii<angleStage-1; ii++){
		linesBuffer.push(anglePoints[ii]);
		linesBuffer.push(anglePoints[ii+1]);
	}
	var angleL = presenter.createEntity("angleL", "lines", linesBuffer);
	angleL.color = [0.2, 0.3, 0.9, 1.0];
  angleL.useSeethrough = true;
  angleL.zOff = 0.001;

  if(angleStage == 3){
    var v1 = SglVec3.normalize(SglVec3.sub(anglePoints[0], anglePoints[1]));
    var v2 = SglVec3.normalize(SglVec3.sub(anglePoints[2], anglePoints[1]));      
    var len = 0.75 * Math.min(SglVec3.length(SglVec3.sub(anglePoints[0], anglePoints[1])), SglVec3.length(SglVec3.sub(anglePoints[2], anglePoints[1])));
    var triBuffer = [];
    triBuffer.push(anglePoints[1]);
    triBuffer.push(SglVec3.add(SglVec3.muls(v1,len),anglePoints[1]));
    triBuffer.push(SglVec3.add(SglVec3.muls(v2,len),anglePoints[1]));
    var angleV = presenter.createEntity("angleV", "triangles", triBuffer);
    angleV.color = [0.2, 0.5, 0.7, 0.3];
    angleV.useTransparency = true;
    angleV.useSeethrough = true;
    angleV.zOff = 0.001;
  }
  else{
    presenter.deleteEntity("angleV");
  }
	presenter.repaint();
}

// function that fills the buffer to create an entity of a triangled tube between two points
// thickness is HALF the thickness of the tube
function tube(p0, p1, thickness){
  var dt = thickness;
  
	var dir = SglVec3.normalize(SglVec3.sub(p1, p0));
	vInitial = [0.0, 0.0, 0.0];
	do {
		vInitial[0] = Math.random()+0.01;
		vInitial[1] = Math.random()+0.01;
		vInitial[2] = Math.random()+0.01;
		vInitial = SglVec3.normalize(vInitial);
	} while (SglVec3.dot(dir, vInitial) > 0.9);
	var v0 = SglVec3.normalize(SglVec3.cross(dir, vInitial));
	var v1 = SglVec3.normalize(SglVec3.cross(dir, v0));

	// from Optimizing Triangle Strips for Fast Rendering https://www.cs.umd.edu/gvil/papers/av_ts.pdf
	// triangle strip of a cube
	var vertices = [];
	vertices[1] = SglVec3.add(p0, SglVec3.muls(v0, dt));
	vertices[2] = SglVec3.add(p0, SglVec3.muls(v1,-dt));
	vertices[3] = SglVec3.add(p0, SglVec3.muls(v1, dt));
	vertices[4] = SglVec3.add(p0, SglVec3.muls(v0,-dt));
	vertices[5] = SglVec3.add(p1, SglVec3.muls(v0, dt));
	vertices[6] = SglVec3.add(p1, SglVec3.muls(v1,-dt));
	vertices[7] = SglVec3.add(p1, SglVec3.muls(v0,-dt));
	vertices[8] = SglVec3.add(p1, SglVec3.muls(v1, dt));
	var triBuffer = [];
	triBuffer.push(vertices[4]);
	triBuffer.push(vertices[3]);
	triBuffer.push(vertices[7]);
	triBuffer.push(vertices[8]);
	triBuffer.push(vertices[5]);
	triBuffer.push(vertices[3]);
	triBuffer.push(vertices[1]);
	triBuffer.push(vertices[4]);
	triBuffer.push(vertices[2]);
	triBuffer.push(vertices[7]);
	triBuffer.push(vertices[6]);
	triBuffer.push(vertices[5]);
	triBuffer.push(vertices[2]);
	triBuffer.push(vertices[1]);

  return triBuffer;
}

// sections functions------------------------------------------------

function sectionToolShow(state){  // show/hide section panel
  if(state){
    $("#sections-box").removeClass('invisible').fadeIn('fast')
  }
  else {
    $("#sections-box").addClass('invisible').fadeOut('fast')
  }
}

function setSections(){
  /*
  in VIEWER_STATE
  clipping : [false, false, false], //active x,y,z
  clippingDir : [1, 1, 1], //direction x,y,z
  clippingPoint : [0.5, 0.5, 0.5], //x,y,z
  clippingRender : [true, true], //render planes, render border
  */

  // update rendering in presenter
  presenter.setClippingX(VIEWER_STATE.clipping[0]?VIEWER_STATE.clippingDir[0]:0);
  presenter.setClippingY(VIEWER_STATE.clipping[1]?VIEWER_STATE.clippingDir[1]:0);
  presenter.setClippingZ(VIEWER_STATE.clipping[2]?VIEWER_STATE.clippingDir[2]:0);

  presenter.setClippingPointX(VIEWER_STATE.clippingPoint[0]); 
  presenter.setClippingPointY(VIEWER_STATE.clippingPoint[1]); 
  presenter.setClippingPointZ(VIEWER_STATE.clippingPoint[2]);

  presenter.setClippingRendermode(VIEWER_STATE.clippingRender[0], VIEWER_STATE.clippingRender[1]);

  presenter.repaint();

  // update interface
  $("#xPlaneToggle").attr('src', VIEWER_STATE.clipping[0]?'img/ico/sectionX_on.png':'img/ico/sectionX_off.png');
  $("#yPlaneToggle").attr('src', VIEWER_STATE.clipping[1]?'img/ico/sectionY_on.png':'img/ico/sectionY_off.png');
  $("#zPlaneToggle").attr('src', VIEWER_STATE.clipping[2]?'img/ico/sectionZ_on.png':'img/ico/sectionZ_off.png');

  $("#xPlaneRange").val(VIEWER_STATE.clippingPoint[0]);
  $("#yPlaneRange").val(VIEWER_STATE.clippingPoint[1]);
  $("#zPlaneRange").val(VIEWER_STATE.clippingPoint[2]);

  $("#xPlaneFlip").prop('checked', VIEWER_STATE.clippingDir[0]==-1);
  $("#yPlaneFlip").prop('checked', VIEWER_STATE.clippingDir[1]==-1);
  $("#zPlaneFlip").prop('checked', VIEWER_STATE.clippingDir[2]==-1);

  $("#showPlane").prop('checked', VIEWER_STATE.clippingRender[0]);
  $("#showEdges").prop('checked', VIEWER_STATE.clippingRender[1]);

  togglePlanesEdgesTool();  
}

function sectionReset(){
  VIEWER_STATE.clipping = DEFAULT_VIEWER_STATE.clipping.slice();
  VIEWER_STATE.clippingDir = DEFAULT_VIEWER_STATE.clippingDir.slice();
  VIEWER_STATE.clippingPoint = DEFAULT_VIEWER_STATE.clippingPoint.slice();
  VIEWER_STATE.clippingRender = DEFAULT_VIEWER_STATE.clippingRender.slice();
  setSections();
}

function togglePlanesEdgesTool(){
  if (VIEWER_STATE.clipping[0] || VIEWER_STATE.clipping[1] || VIEWER_STATE.clipping[2]){
    $("#planesEdgesDiv").removeClass('invisible')
  }
  else{
    $("#planesEdgesDiv").addClass('invisible');
  }
}






// trackball utilities--------------------------------------------------------------
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
//---------------------------------------------------------------------------------------


//EXPERIMENT
$("#btLight").on('mousedown', openLightControl);
$(document).on('mouseup', closeLightControl);
$('#draw-canvas').on('mouseup', closeLightControl);

function openLightControl(event){
  //console.log("openLightControl");
  //console.log(event);
  //console.log(event.clientX);
  //console.log(event.clientY);
  var lightControllerCanvas = document.getElementById("lightcontroller");
  lightControllerCanvas.width = 200;
	lightControllerCanvas.height = 200;	
  lightControllerCanvas.style.display = "block";
  lightControllerCanvas.style.position = "absolute";
  lightControllerCanvas.style.transform = "translate(-79px, -81px)";//"translate(-50%, -50%)";
  lightControllerCanvas.style.zIndex = 1000;
  updateLightController(VIEWER_STATE.lightDir[0],VIEWER_STATE.lightDir[1]);
  (event.touches) ? lightControllerCanvas.addEventListener("touchmove", clickLightController, false) : lightControllerCanvas.addEventListener("mousemove", clickLightController, false);
  //clickLightController(event);
}
function closeLightControl(event){
  var lightControllerCanvas = document.getElementById("lightcontroller");
  lightControllerCanvas.style.display = "none";
}
//END EXPERIMENT


///////////////////
// LIGHT CONTROL //
///////////////////
function resizeLightController(){
	var lightControllerCanvas = document.getElementById("lightcontroller");
	var dim = Math.min(150, Math.min(lightControllerCanvas.parentElement.clientWidth,lightControllerCanvas.parentElement.clientHeight));
	lightControllerCanvas.width = dim;
	lightControllerCanvas.height = dim;	
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
    VIEWER_STATE.lightDir = [lx,-ly];
    presenter.rotateLight(VIEWER_STATE.lightDir[0],VIEWER_STATE.lightDir[1]);
    updateLightController(VIEWER_STATE.lightDir[0],VIEWER_STATE.lightDir[1]);
    (event.touches) ? lightControllerCanvas.addEventListener("touchmove", clickLightController, false) : lightControllerCanvas.addEventListener("mousemove", clickLightController, false);
  }
}
function doubleclickLightController(event) {
  event.preventDefault();  
  VIEWER_STATE.lighting = !VIEWER_STATE.lighting;
  presenter.enableSceneLighting(VIEWER_STATE.lighting);
  updateLightController(VIEWER_STATE.lightDir[0],VIEWER_STATE.lightDir[1]);
}
function updateLightController(xx,yy) {
	var lightControllerCanvas = document.getElementById("lightcontroller");
	var cwidth = lightControllerCanvas.width;
	var cheight = lightControllerCanvas.height;
	var midpoint = [Math.floor(cwidth/2.0),Math.floor(cheight/2.0)];
	var radius = Math.min(midpoint[0],midpoint[1]);
	var context = lightControllerCanvas.getContext("2d");
	context.clearRect(0, 0, cwidth, cheight);
	var lightcolor = presenter.isSceneLightingEnabled()?"yellow":"grey";
	context.beginPath();
	context.arc(midpoint[0], midpoint[1], radius, 0, 2 * Math.PI, false);
	var grd=context.createRadialGradient(midpoint[0]+(xx*(radius-3)*2),midpoint[1]+(-yy*(radius-3)*2),3,midpoint[0], midpoint[1],radius);
	grd.addColorStop(0,lightcolor);
	grd.addColorStop(1,"black");
	context.fillStyle = grd;
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = 'black';
	context.stroke();
	//central spot
	context.beginPath();
	context.rect(midpoint[0]+(xx*radius*2)-1,midpoint[1]+(-yy*radius*2)-1,3,3);
	context.lineWidth = 3;
	context.strokeStyle = lightcolor;
	context.stroke();
	presenter.repaint();
}
function initLightController(lightX,lightY) {
	resizeLightController();
	var lightControllerCanvas = document.getElementById("lightcontroller");
	lightControllerCanvas.addEventListener("touchstart", clickLightController, false);
	lightControllerCanvas.addEventListener("mousedown", clickLightController, false);
	lightControllerCanvas.addEventListener("dblclick", doubleclickLightController, false);
	var canvas = document.getElementById("draw-canvas");
	canvas.addEventListener("mouseup", function () { 
		lightControllerCanvas.removeEventListener("mousemove", clickLightController, false); 
		lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
	}, false);
	document.addEventListener("mouseup", function () { 
		lightControllerCanvas.removeEventListener("mousemove", clickLightController, false);
		lightControllerCanvas.removeEventListener("touchmove", clickLightController, false);
	}, false);
	presenter.rotateLight(lightX, lightY);
	updateLightController(lightX, lightY);	
}
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////


function buildModelParamArray(){
  let dati = {
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



function resizeCanvas(){
  let w = $('#3dhop').parent().width()
  let h = $('#3dhop').parent().height();
  $('#draw-canvas').attr('width', w);
	$('#draw-canvas').attr('height',h);
	$('#3dhop').css('width', w);
	$('#3dhop').css('height', h);
  if(presenter) presenter.repaint();
}