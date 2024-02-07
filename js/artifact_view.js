let storagePlaceMarker, findplaceMarker;
let markerArr={}
let polyArr={}

ajaxSettings.url=API+"artifact.php";
ajaxSettings.data={trigger:'getArtifact', id:artifactId};

$.ajax(ajaxSettings)
.done(function(data) {
  console.log(data);
  $("#loadingDiv").remove()
  let artifact = data.artifact;
  $("h2#title").text(artifact.name)
  Object.keys(artifact).forEach(function(key) {
    if(artifact[key]){
      artifact['is_museum_copy'] = artifact['is_museum_copy'] == 0 ? false : true;
      let statusClass = artifact['status_id'] == 1 ? 'alert-danger' : 'alert-success';
      $("#status").addClass(statusClass).text(artifact.status);
      if(key == 'notes' || key == 'description'){ artifact[key] = nl2br(artifact[key])}
      if(key == 'status'){ artifact[key] = 'The item status is: '+artifact[key] }
      if(key == 'from'){ $("#start_period").text(artifact.from.definition)}
      if("to" in artifact){ $("#end_period").text(artifact.to.definition)}else{$("#end_period").parent().remove()}
      $("#"+key).html(artifact[key])
    }else{
      if(!role){$("#"+key).parent('li').remove()}
      if(artifact.category_class_id == 128){
        $("#category_class").parent('li').remove()
        $("#category_specs").parent('li').remove()
      }
      if(artifact.conservation_state_id == 11){$("#conservation_state").parent('li').remove()}
      if(artifact.object_condition_id == 9){$("#object_condition").parent('li').remove()}
    }
  })

  let material = data.artifact_material_technique;
  material.forEach((item) => {
    $("<li/>", {class:'list-group-item ps-0 pt-0'}).text(item.material +" / "+(item.technique ? item.technique : 'not defined') ).appendTo('#material>ol')
  });

  let institution = data.storage_place;
  let gMapLink = 'http://maps.google.com/maps?q='+institution.name.replace(/ /g,"+");
  $("#institutionLogo>img").attr("src", "img/logo/"+institution.logo)
  $("#storage_name").text(institution.name)
  $("#gMapLink").attr("href",gMapLink)
  $("#storage_address").text(institution.address)
  $("#storage_link").attr("href",institution.link).text(institution.link)
  markerArr.storage = [parseFloat(institution.lat), parseFloat(institution.lon)]

  if (data.artifact_findplace) {
    let findplace = data.artifact_findplace;
    if(findplace.city_id){polyArr.county=findplace.county_id}
    if(findplace.city_id){polyArr.city = findplace.city_id}
    if(findplace.latitude){
    markerArr.findplace = [parseFloat(findplace.latitude), parseFloat(findplace.longitude)]
    }
    Object.keys(findplace).forEach(function(key) {
      if(findplace[key]){
        if(key == 'notes'){ artifact[key] = nl2br(artifact[key])}
        $("#findplace_"+key).html(findplace[key])
      }
    })
  }else{
    if(!role){$("#findplaceAccordionSection").remove()}
  }

  if (typeof data.artifact_measure != "undefined") {
    let measure = data.artifact_measure;
    measure.forEach((item, i) => {
      Object.keys(item).forEach(function(key) {
        if (key == 'notes') {$("#measures_"+key).text(item[key])}
        if(item[key]){$("#"+key).text(item[key])}
      })
    });
  }else{
    if(!role){$("#measureAccordionSection").remove()} 
  }
  let metadata = data.artifact_metadata;
  $("#artifact_author>a").attr("href","person_view.php?person="+metadata.author.id).text(metadata.author.last_name+" "+metadata.author.first_name)
  $("#artifact_owner>a").attr("href","institution_view.php?institution="+metadata.owner.id).text(metadata.owner.name)
  $("#artifact_license>a").attr("href",metadata.license.link).text(metadata.license.license+" ("+metadata.license.acronym+")")

  if(data.model){
    $("#editModelBtn > a").attr('href','model_view.php?item='+data.model.model.id);
    let model = data.model.model_object[0];
    if (model.object) {
      if((role && role < 5) || (activeUser && model.author_id === activeUser)){
        $("[name=saveModelParam]").on('click', function(){
          let dati = buildModelParamArray()
          dati.model = model.id
          dati.trigger = 'updateModelParam'
          saveModelParam(dati)
        })
      }else{
        $("[name=saveModelParam]").remove()
      }
      $("#addModelBtn").remove();
      initModel(data.model)
    }else{
      $("#3dhop > canvas, .modelTools, .model-accordion").remove()
    }
  }else {
    $("#3dhop > canvas, .modelTools, .model-accordion").remove()
    let noModelDiv = $("<div/>",{id:'alertModel'}).appendTo("#3dhop");
    $("<div/>",{class:'alert alert-info fs-3'}).text('Model not yet available!!').appendTo(noModelDiv);
    $("#editModelBtn").remove();
  }
  artifactMap()  
});