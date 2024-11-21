const usrId = $("[name=usrId]").val()
const usrCls = $("[name=usrCls]").val()
const usrInst = $("[name=usrInst]").val()
let issues = 0;

catList()
mapInit()
getArtifacts()
getModels()
getInstitutions(0)
getPersons(0)
artifactIssues()

$("#modelDashboardGallery").css("height",$(".listDashBoard").height())
$("[name=artifactStatus]").on('change', getArtifacts)
$("[name=modelStatus]").on('change', getModels)

$("[name=searchByDescriptionBtn]").on('click', function(){
  let q = $("[name=searchByDescription]").val()
  if(q.length < 3){
    alert('You have to enter 3 characters at least')
    return false;
  }
  getArtifacts()
  $("[name=resetDescriptionBtn]").removeClass('d-none');
})
$("[name=resetDescriptionBtn]").on('click', function(e){
  $("[name=searchByDescription]").val('');
  getArtifacts()
  $(this).addClass('d-none')
})

$(document).on('click', '#listInstitutionCategory > li > button', function(){
  $("#dropdownInstitutionCategory").text($(this).text())
  $('#listInstitutionCategory > li > button').removeClass('active')
  $(this).addClass('active')
  getInstitutions($(this).val())
})
$("[name=searchByInstitutionNameBtn]").on('click', function(){
  let q = $("[name=searchByInstitutionName]").val()
  if(q.length < 3){
    alert('You have to enter 3 characters at least')
    return false;
  }
  getInstitutions($('#listInstitutionCategory > li > button.active').val())
  $("[name=resetInstitutionNameBtn]").removeClass('d-none');
})
$("[name=resetInstitutionNameBtn]").on('click', function(e){
  $("[name=searchByInstitutionName]").val('');
  getInstitutions($('#listInstitutionCategory > li > button.active').val())
  $(this).addClass('d-none')
})

$(document).on('click', '#listPersonCategory > li > button', function(){
  $("#dropdownPersons").text($(this).text())
  $('#listPersonCategory > li > button').removeClass('active')
  $(this).addClass('active')
  getPersons($(this).val())
})

$("[name=searchByPersonNameBtn]").on('click', function(){
  let q = $("[name=searchByPersonName]").val()
  if(q.length < 3){
    alert('You have to enter 3 characters at least')
    return false;
  }
  getPersons($('#listPersonCategory > li > button.active').val())
  $("[name=resetPersonNameBtn]").removeClass('d-none');
})
$("[name=resetPersonNameBtn]").on('click', function(e){
  $("[name=searchByPersonName]").val('');
  getPersons($('#listPersonCategory > li > button.active').val())
  $(this).addClass('d-none')
})

function catList(){
  ajaxSettings.url=API+"institution.php";
  ajaxSettings.data = {trigger:'catlist'};
  $.ajax(ajaxSettings).done(function(data){
    $("#listInstitutionCategory").html('<li><button type="button" class="dropdown-item active" value="0">all categories</button></li>')
    data.forEach((c)=>{
      let li = $("<li/>").appendTo("#listInstitutionCategory");
      $("<button/>",{type:'button', class:'dropdown-item',value:c.id,text:c.value}).appendTo(li)
    })
  })
}

function getArtifacts(){
  let search={}
  let dati={}
  let txt = ''
  search.status = parseInt($("[name=artifactStatus]:checked").val())
  if($("[name=searchByDescription]").val()){search.description = $("[name=searchByDescription]").val()}
  switch (search.status) {
    case 1: txt = 'under processing'; break;
    case 2: txt = 'complete'; break;
    default: txt = '';
  }
  $("#artifactStatusTitle").text(txt);
  $('#artifactList .listWrap').html('')
  dati.trigger='getArtifacts';
  dati.search = search;
  ajaxSettings.url=API+"artifact.php";
  ajaxSettings.data = dati 
  $.ajax(ajaxSettings).done(function(data){
    $('#artifactList .badge').text(data.length)
    data.forEach((item, i) => {
      let li = $("<p/>", {class: 'list-group-item list-group-item-action'}).attr("href","artifact_view.php?item="+item.id).appendTo('#artifactList .listWrap');
      $('<span/>').text(item.name).appendTo(li)
      $('<span/>').text(item.description).appendTo(li)
      $('<span/>').text(item.last_update).appendTo(li)
      let a = $('<span/>',{class:'text-center'}).appendTo(li)
      $("<a/>",{class:'text-dark', title:'open artifact page'}).html('<span class="mdi mdi-arrow-right-bold fs-4"></span>').attr({"href":"artifact_view.php?item="+item.id, "data-bs-toggle":"tooltip"}).appendTo(a).tooltip();
    });
  });
}

function getModels(){
  let search = {}
  let dati={}
  let cardWrap = $("#modelDashboardGallery");
  search.status = parseInt($("[name=modelStatus]:checked").val())
  switch (search.status) {
    case 1: txt = 'under processing'; break;
    case 2: txt = 'complete'; break;
    default: txt = '';
  }
  $("#modelStatusTitle").text(txt);
  cardWrap.html('')
  dati.trigger='getModels';
  dati.search = search;
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    $('#modelList .badge').text(data.length)
    data.forEach((item, i) => {
      let card = $("<div/>",{class:' card modelCardSmall'}).appendTo(cardWrap);
      $("<div/>", {class:'thumbDiv card-header'}).css("background-image", "url(archive/thumb/"+item.thumbnail+")").appendTo(card)
      let divDati = $("<div/>",{class:'card-body'}).appendTo(card)
      let descript = $("<p/>", {class:'m-0'}).text(cutString(item.description,50)).appendTo(divDati)
      if(item.description.length > 50){
        descript.addClass('pointer').attr({"data-bs-toggle":"tooltip", "data-bs-title":item.description}).tooltip()
      }
      if(usrCls < 4){
        $("<p/>", {class:'my-1'}).html("<span class='fw-bold me-2'>Author</span><span>"+item.author+"</span>").appendTo(divDati)
      }
      // let alertClass = item.status == 2 ? 'alert-success' : 'alert-danger';
      // $("<div/>", {class:'p-1 m-0 alert '+alertClass, role:'alert'}).text(item.status == 1 ? 'under processing' : 'complete').appendTo(divDati)

      let footer = $("<div/>",{class:'card-footer bg-white border-0'}).appendTo(card);
      $("<a/>",{class:'btn btn-sm btn-adc-dark d-block', href:'model_view.php?item='+item.id}).text('view model').appendTo(footer)
    });
  });
}

function getInstitutions(filterCat){
  let dati={search:{}}
  dati.trigger='getInstitutions';
  dati.search.cat = parseInt(filterCat);
  let q = $("[name=searchByInstitutionName]").val();
  if(q){ dati.search.name = q }
  let institutionGroup = L.featureGroup().addTo(map);
  let cardWrap = $("#institutionDasboardList");
  cardWrap.html('')
  ajaxSettings.url=API+"institution.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){    
    $('#institutionList .badge').text(data.length)
    data.forEach((item, i) => {
      let logo = item.logo ? item.logo : 'default.jpg';
      let card = $("<div/>",{class:"card mb-3"}).appendTo(cardWrap)  
      let row = $("<div/>", {class:'row g-0'}).appendTo(card)
      $("<div/>", {class:'cardLogo col-md-4'}).css("background-image", "url(img/logo/"+logo+")").appendTo(row)
      let col2 = $("<div/>", {class:'col-md-8'}).appendTo(row)
      let body =$("<div/>",{class:'card-body'}).appendTo(col2)
      $("<h5/>",{class:'card-title fw-bold'}).text(item.name+" ("+item.abbreviation+")").appendTo(body)
      $("<p/>",{class:'card-text m-0'}).html('category: <span class="fw-bold">'+item.category+"</span>").appendTo(body)
      $("<a/>",{href:'http://maps.google.com/maps?q='+item.name.replace(/ /g,"+"), title:'view on Google Maps', target:'_blank', class:'card-link d-block'}).html('<i class="mdi mdi-map-marker"></i> '+item.address+', '+item.city).appendTo(body)
      if(item.url){
        $("<a/>",{href:item.url, title:'Official Webpage', target:'_blank', class:'card-link d-block m-0'}).html('<i class="mdi mdi-link-variant"></i> '+item.url).appendTo(body)
      }
      $("<p/>",{class:'card-text m-0'}).text("Number of artifacts stored by Institute: "+item.artifact_count).appendTo(body)

      let btnDiv = $("<div/>", {class:'mt-3'}).appendTo(body)

      if(usrCls == 1 || (usrCls == 2 && usrInst == item.id) ){
        $("<a/>",{href:'institution_edit.php?item='+item.id, class:'btn btn-sm btn-outline-secondary'}).html('<span class="mdi mdi-pencil"></span> edit').appendTo(btnDiv)
      }


      if(item.artifact == 0){
        $("<button/>",{class:'btn btn-sm btn-outline-danger ms-3'}).html('<span class="mdi mdi-delete-forever"></span> delete').appendTo(btnDiv).on('click',function(){deleteInstitution(item.id)})
      }

      L.marker([parseFloat(item.lat), parseFloat(item.lon)],{icon:storagePlaceIco})
        .bindPopup("<div class='text-center'><h6 class='p-0 m-0'>"+item.name+"</h6><p class='p-0 m-0'>Artifacts stored: <strong>"+item.artifact+"</strong></p></div>")
        .addTo(institutionGroup);
    });
    map.fitBounds(institutionGroup.getBounds())
    btnHome.on('click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      map.fitBounds(institutionGroup.getBounds());
    });
  });
}

function getPersons(filterCat){
  $('#personList .listWrap').html('')
  let dati={search:{}}
  dati.trigger='getPersons';
  dati.search.cat = parseInt(filterCat);
  let q = $("[name=searchByPersonName]").val();
  if(q){dati.search.name = q}
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    console.log(data);
    
    $('#personList .badge').text(data.length)
    data.forEach((item, i) => {
      let institute = item.institution !== null ? item.institution : 'not present';
      let position = item.position !== null ? item.position : 'not present';
      let isActive = item.is_active == 1 ? 'true' : 'false';
      let li = $("<li/>", {class: 'list-group-item list-group-item-action '}).appendTo('#personList .listWrap');
      $('<a/>', {class:'alert alert-warning p-2 m-0 fs-6 d-block'}).text(item.name).attr("href","person_view.php?person="+item.id).appendTo(li)
      $('<span/>').html("Institution: <strong>"+institute+"</strong>").appendTo(li)
      $('<span/>').html('Position: <strong>'+position+"</strong>").appendTo(li)
      $('<span/>').html("Email: <strong>" +item.email+"</strong>").appendTo(li)
      if(item.role === null){
        $('<span/>', {class:'alert alert-danger p-1 my-2'}).text("the person has no system account").appendTo(li)
      }else{
        $('<span/>').html("Role: <strong>" +item.role+"</strong>").appendTo(li)
        $('<span/>').html("Is active: <strong>"+isActive+"</strong>").appendTo(li)
        $('<span/>').html("Inserted artifacts: <strong>" +item.artifact+"</strong>").appendTo(li)
        $('<span/>').html("Inserted models: <strong>" +item.model+"</strong>").appendTo(li)
      }
      let btnDiv = $("<div/>", {class:'mt-3'}).appendTo(li)
      $("<a/>",{href:'person_view.php?item='+item.id, class:'btn btn-sm btn-outline-secondary me-2'}).html('<span class="mdi mdi-account d-inline-block"></span> view profile').appendTo(btnDiv)
      if(usrCls == 1 || (usrCls == 2 && usrInst == item.inst_id) || usrId == item.id ){
        $("<a/>",{href:'person.php?item='+item.id, class:'btn btn-sm btn-outline-secondary'}).html('<span class="mdi mdi-pencil d-inline-block"></span> edit').appendTo(btnDiv)
      }
    });
  });
}
function deleteInstitution(inst){
  let conf = confirm('You are going to permanently delete a record from the database, are you sure?')
  if(conf == true){
    ajaxSettings.url=API+"institution.php";
    ajaxSettings.data = {trigger:'deleteInstitution', id:inst}
    $.ajax(ajaxSettings).done(function(data){
      alert(data.output)
      if(data.res = 1){ getInstitutions(0) }
    })
  }
}

function artifactIssues(){
  ajaxSettings.url=API+"artifact.php";
  ajaxSettings.data = {trigger:'artifactIssues'}
  $.ajax(ajaxSettings).done(function(data){
    if(data.missingModel.length > 0){
      issues = issues + data.missingModel.length
      let div = $("<div/>",{id:'missingModel',class:'bg-white border rounded shadow p-3'}).appendTo("#issuesBody");
      let title = $("<h6/>").appendTo(div)
      $("<span/>").text('Missing 3d file').appendTo(title)
      $("<span/>",{class:'badge text-bg-dark float-end'}).text(data.missingModel.length).appendTo(title)
      let wrapTable = $("<div/>",{class:'wrapIssuesTable'}).appendTo(div)
      let table = $("<table/>",{class:'table table-sm'}).appendTo(wrapTable)
      let head = $("<thead/>",{class:'table-light sticky-top'}).appendTo(table)
      $('<tr/>').html('<th scope="col">name</th><th scope="col">#</th>').appendTo(head);
      let body = $("<tbody/>").appendTo(table)
      data.missingModel.forEach(row => {
        let tr = $("<tr/>").appendTo(body)
        $("<td/>").html("artifact: "+row.name+"<br/>expected file: "+row.object).appendTo(tr)
        $("<td/>").html('<a href="artifact_view.php?item='+row.artifact+'" class="text-dark"><span class="mdi mdi-arrow-right-bold"></span></a>').appendTo(tr)
      })
      $("<div/>",{class:'tableIssuesFoot mt-3'}).html("<span class='mdi mdi-lightbulb-on text-warning'></span> <span class='text-secondary'>Check in the model folder on the file system if the file name is the same as in the database</span>").appendTo(div)
    }
    if(data.chronoNotInRange.length > 0){
      issues = issues + data.chronoNotInRange.length
      let div = $("<div/>",{id:'chronoNotInRange',class:'bg-white border rounded shadow p-3'}).appendTo("#issuesBody");
      let title = $("<h6/>").appendTo(div)
      $("<span/>").text('Chronology not in timeline').appendTo(title)
      $("<span/>",{class:'badge text-bg-dark float-end'}).text(data.chronoNotInRange.length).appendTo(title)

      let wrapTable = $("<div/>",{class:'wrapIssuesTable'}).appendTo(div)
      let table = $("<table/>",{class:'table table-sm'}).appendTo(wrapTable)
      let head = $("<thead/>",{class:'table-light sticky-top'}).appendTo(table)
      $('<tr/>').html('<th scope="col">name</th><th scope="col">start</th><th scope="col">end</th><th scope="col">#</th>').appendTo(head);
      let body = $("<tbody/>").appendTo(table)
      data.chronoNotInRange.forEach(row => {
        let tr = $("<tr/>").appendTo(body)
        $("<td/>").text(row.name).appendTo(tr)
        $("<td/>").text(row.start).appendTo(tr)
        $("<td/>").text(row.end).appendTo(tr)
        $("<td/>").html('<a href="artifact_view.php?item='+row.id+'" class="text-dark"><span class="mdi mdi-arrow-right-bold"></span></a>').appendTo(tr)
      })
      $("<div/>",{class:'tableIssuesFoot mt-3'}).html("<span class='mdi mdi-lightbulb-on text-warning'></span> <span class='text-secondary'>Check if the date was mistyped or if a new value should be added to the timeline</span>").appendTo(div)
    }
    if(data.chronoNullValue.length > 0){
      issues = issues + data.chronoNullValue.length
      let div = $("<div/>",{id:'chronoNullValue',class:'bg-white border rounded shadow p-3'}).appendTo("#issuesBody");
      let title = $("<h6/>").appendTo(div)
      $("<span/>").text('No chronology value').appendTo(title)
      $("<span/>",{class:'badge text-bg-dark float-end'}).text(data.chronoNullValue.length).appendTo(title)

      let wrapTable = $("<div/>",{class:'wrapIssuesTable'}).appendTo(div)
      let table = $("<table/>",{class:'table table-sm'}).appendTo(wrapTable)
      let head = $("<thead/>",{class:'table-light sticky-top'}).appendTo(table)
      $('<tr/>').html('<th scope="col">name</th><th scope="col">start</th><th scope="col">end</th><th scope="col">#</th>').appendTo(head);
      let body = $("<tbody/>").appendTo(table)
      data.chronoNullValue.forEach(row => {
        let tr = $("<tr/>").appendTo(body)
        $("<td/>").text(row.name).appendTo(tr)
        $("<td/>").text(row.start).appendTo(tr)
        $("<td/>").text(row.end).appendTo(tr)
        $("<td/>").html('<a href="artifact_view.php?item='+row.id+'" class="text-dark"><span class="mdi mdi-arrow-right-bold"></span></a>').appendTo(tr)
      })
      $("<div/>",{class:'tableIssuesFoot mt-3'}).html("<span class='mdi mdi-lightbulb-on text-warning'></span> <span class='text-secondary'>If you don't know a specific date you can also just enter the start date of the macro period</span>").appendTo(div)
    }
    if(data.noDescription.length > 0){
      issues = issues + data.noDescription.length;
      let div = $("<div/>",{id:'noDescription',class:'bg-white border rounded shadow p-3'}).appendTo("#issuesBody");
      let title = $("<h6/>").appendTo(div)
      $("<span/>").text('No artifact description').appendTo(title)
      $("<span/>",{class:'badge text-bg-dark float-end'}).text(data.noDescription.length).appendTo(title)

      let wrapTable = $("<div/>",{class:'wrapIssuesTable'}).appendTo(div)
      let table = $("<table/>",{class:'table table-sm'}).appendTo(wrapTable)
      let head = $("<thead/>",{class:'table-light sticky-top'}).appendTo(table)
      $('<tr/>').html('<th scope="col">name</th><th scope="col">#</th>').appendTo(head);
      let body = $("<tbody/>").appendTo(table)
      data.noDescription.forEach(row => {
        let tr = $("<tr/>").appendTo(body)
        $("<td/>").text(row.name).appendTo(tr)
        $("<td/>").html('<a href="artifact_view.php?item='+row.id+'" class="text-dark"><span class="mdi mdi-arrow-right-bold"></span></a>').appendTo(tr)
      })
      $("<div/>",{class:'tableIssuesFoot mt-3'}).html("<span class='mdi mdi-lightbulb-on text-warning'></span> <span class='text-secondary'>Add a brief description to help the user better understand the artifact</span>").appendTo(div)
    }
    
    if(issues > 0){
      $("#issuesSection").addClass('alert-danger');
      $("#issuesTitle").text('The following issues were detected!');
    }else{
      $("#issuesSection").addClass('alert-success text-center')
      $("#issuesTitle").text('No issues detected!');
    }
  })
}