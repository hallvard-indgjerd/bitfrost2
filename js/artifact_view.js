let storagePlaceMarker, findplaceMarker;
let markerArr = {}

ajaxSettings.url=API+"artifact.php";
ajaxSettings.data={trigger:'getArtifact', id:artifactId};

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

$("[name=resetViewBtn]").on('click', function(){
  home()
  $("[name=viewside]").removeClass('active')
  $("#dropdownViewList").text('set view')
})
$("[name=viewside]").on('click', function(){ 
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

$("[name=changeGrid]").on('click', function(){ 
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
  if(func !== 'section'){
    disableToolsFunction()
    if($(this).is(':checked')){ 
      $(".measureTool").not(this).not("#section").prop('checked', false) 
    }
  }
  let act = $(this).is(':checked') ? func+'_on' : func+'_off';
  actionsToolbar(act);
})

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

$.ajax(ajaxSettings)
.done(function(data) {
  let artifact = data.artifact;
  Object.keys(artifact).forEach(function(key) {
    if(!artifact[key]){artifact[key] = 'not defined'}
    if(key == 'status'){ artifact[key] = 'The item status is: '+artifact[key] }
    if(key == 'from'){ $("#start_period").text(artifact['from']['definition'])}
    if(key == 'to'){ $("#end_period").text(artifact['to']['definition'])}
    let statusClass = artifact['status_id'] == 1 ? 'alert-danger' : 'alert-success';
    $("#status").addClass(statusClass).text("The item status is: "+artifact.status);
    artifact['is_museum_copy'] = artifact['is_museum_copy'] == 0 ? false : true;
    $("#"+key).text(artifact[key])
  })

  let material = data.artifact_material_technique;
  material.forEach((item) => {
    $("<li/>", {class:'list-group-item ps-0'}).text(item.material +" / "+(item.technique ? item.technique : 'not defined') ).appendTo('#material>ol')
  });

  let institution = data.storage_place;
  let gMapLink = 'http://maps.google.com/maps?q='+institution.name.replace(/ /g,"+");
  $("#storage_name").text(institution.name)
  $("#gMapLink").attr("href",gMapLink)
  $("#storage_address").text(institution.address)
  $("#storage_link").attr("href",institution.link).text(institution.link)
  markerArr.storage = [parseFloat(institution.lat), parseFloat(institution.lon)]

  if (data.artifact_measure) {
    let measure = data.artifact_measure;
    measure.forEach((item, i) => {
      Object.keys(item).forEach(function(key) {
        if (key == 'notes') {$("#measures_"+key).text(item[key])}
        if(item[key]){$("#"+key).text(item[key])}
      })
    });
  }
  let metadata = data.artifact_metadata;
  $("#artifact_author>a").attr("href","person_view.php?person="+metadata.author.id).text(metadata.author.last_name+" "+metadata.author.first_name)
  $("#artifact_owner>a").attr("href","institution_view.php?institution="+metadata.owner.id).text(metadata.owner.name)
  $("#artifact_license>a").attr("href",metadata.license.link).text(metadata.license.license+" ("+metadata.license.acronym+")")

  if(data.model){
    let model = data.model;
    let metadata = model.model_metadata
    if((role && role < 5) || (activeUser && metadata.auth_id === activeUser)){
      $("[name=saveModelParam]").removeClass('invisible').on('click', function(){
        saveModelParam(model.model.id)
      })
    }
    if (model.model.nxz) {
      initModel(model)
      $("#model-auth").html("<a href='person_view.php?person="+metadata.auth_id+"'>"+metadata.auth+"</a>");
      $("#model-owner").html("<a href='institution_view.php?inst="+metadata.owner_id+"' class='disabled'>"+metadata.owner+"</a>");
      $("#model-license").html("<a href='"+metadata.licenseLink+"' target='_blank'>"+metadata.license+" ("+metadata.acronym+")</a>");
      $("#model-create_at").text(metadata.create_at)
      $("#model-updated_at").text(metadata.updated_at)
    
      Object.keys(paradata).forEach(function(key) {
        if(paradata[key]){$("#model-"+key).text(paradata[key])}
      })
    }else{
      $("#3dhop > canvas").remove()
      $("<div/>",{id:"alertModel", class:'alert alert-info text-center py-3 fs-3'}).text('Model not yet available!!').appendTo("#3dhop");
    }
  }else {
    $("#3dhop > canvas").remove()
    $("<div/>",{id:"alertModel", class:'alert alert-info text-center py-3 fs-3'}).text('Model not yet available!!').appendTo("#3dhop");
  }

  if (data.artifact_findplace) {
    let findplace = data.artifact_findplace;
    Object.keys(findplace).forEach(function(key) {
      if(findplace[key]){$("#findplace_"+key).text(findplace[key])}
    })
  }
  artifactMap(markerArr)

});

function artifactMap(markerArr){
  map = L.map('map',{maxBounds:mapExt})//.fitBounds(mapExt)
  map.setMinZoom(4);
  osm = L.tileLayer(osmTile, { maxZoom: 18, attribution: osmAttrib}).addTo(map);
  gStreets = L.tileLayer(gStreetTile,{maxZoom: 18, subdomains:gSubDomains });
  gSat = L.tileLayer(gSatTile,{maxZoom: 18, subdomains:gSubDomains});
  gTerrain = L.tileLayer(gTerrainTile,{maxZoom: 18, subdomains:gSubDomains});
  baseLayers = {
    "OpenStreetMap": osm,
    "Google Terrain":gTerrain,
    "Google Satellite": gSat,
    "Google Street": gStreets
  };
  L.control.layers(baseLayers, null).addTo(map);
  let markerGroup = L.featureGroup().addTo(map);
  storagePlaceMarker = L.marker(markerArr['storage'],{icon:storagePlaceIco}).addTo(markerGroup);
  map.fitBounds(markerGroup.getBounds())
}

function saveModelParam(model){
  let dati = {
    trigger:'saveModelParam',
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
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings)
  .done(function(data){
    if (data.res==0) {
      $("#toastDivError .errorOutput").text(data.msg);
      $("#toastDivError").removeClass("d-none");
    }else {
      $(".toastTitle").text(data.msg)
      closeToast.appendTo("#toastBtn");
      $("#toastDivSuccess").removeClass("d-none")
    }
    $("#toastDivContent").removeClass('d-none')
  })
}