let storagePlaceMarker, findplaceMarker;
let markerArr = {}

ajaxSettings.url=API+"artifact.php";
ajaxSettings.data={trigger:'getArtifact', id:artifactId};

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
        saveModelParam(model.model.id, 'updateModelParam')
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

function saveModelParam(model, trigger){
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
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings)
  .done(function(data){
    console.log(data);
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