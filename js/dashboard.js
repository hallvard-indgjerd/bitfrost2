const usrId = $("[name=usrId]").val()
const usrCls = $("[name=usrCls]").val()
mapInit()
getArtifacts()
getModels()
getInstitutions()
getUsers()
getPersons()

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

$("[name=searchByPersonNameBtn]").on('click', function(){
  let q = $("[name=searchByPersonName]").val()
  if(q.length < 3){
    alert('You have to enter 3 characters at least')
    return false;
  }
  getPersons()
  $("[name=resetPersonNameBtn]").removeClass('d-none');
})
$("[name=resetPersonNameBtn]").on('click', function(e){
  $("[name=searchByPersonName]").val('');
  getPersons()
  $(this).addClass('d-none')
})

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
    console.log(data);
    $('#modelList .badge').text(data.length)
    data.forEach((item, i) => {
      let card = $("<div/>",{class:' card modelCardSmall'}).appendTo(cardWrap);
      $("<div/>", {class:'thumbDiv card-header'}).css("background-image", "url(archive/thumb_512/"+item.thumbnail+")").appendTo(card)
      let divDati = $("<div/>",{class:'card-body'}).appendTo(card)
      $("<p/>", {class:'m-0'}).text(item.description).appendTo(divDati)
      if(usrCls < 4){
        $("<p/>", {class:'my-1'}).html("<span class='fw-bold me-2'>Author</span><span>"+item.author+"</span>").appendTo(divDati)
      }
      // $("<p/>", {class:'my-1'}).html("<span class='fw-bold me-2'>Created at</span><span>"+item.create_at+"</span>").appendTo(divDati)
      let alertClass = item.status_id == 0 ? 'alert-success' : 'alert-danger';
      $("<div/>", {class:'p-1 m-0 alert '+alertClass, role:'alert'}).text(item.status == 1 ? 'under processing' : 'complete').appendTo(divDati)

      let footer = $("<div/>",{class:'card-footer bg-white border-0'}).appendTo(card);
      $("<a/>",{class:'btn btn-sm btn-adc-dark d-block', href:'model_view.php?item='+item.id}).text('view model').appendTo(footer)
    });
  });
}

function getInstitutions(){
  let institutionGroup = L.featureGroup().addTo(map);
  let dati={}
  let cardWrap = $("#institutionDasboardList");
  cardWrap.html('')
  dati.trigger='getInstitutions';
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
      $("<p/>",{class:'card-text m-0'}).text("Number of artifacts stored by Institute: "+item.artifact).appendTo(body)

      let btnDiv = $("<div/>", {class:'mt-3'}).appendTo(body)

      $("<a/>",{href:'institution_edit.php?item='+item.id, class:'btn btn-sm btn-outline-secondary'}).html('<span class="mdi mdi-pencil"></span> edit').appendTo(btnDiv)
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

function getUsers(){
  let search={}
  let dati={}
  $('#userList .listWrap').html('')
  dati.trigger='getUsers';
  dati.search = search;
  ajaxSettings.url=API+"user.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    $('#userList .badge').text(data.length)
    data.forEach((item, i) => {
      let css = item.is_active == 1 ? 'text-success' : 'text-danger';
      let li = $("<a/>", {class: 'list-group-item list-group-item-action ' +
    css}).attr("href","person_view.php?person="+item.id).appendTo('#userList .listWrap');
      $('<span/>').text(item.name).appendTo(li)
      $('<span/>').text(item.role).appendTo(li)
      $('<span/>').text(item.is_active == 1 ? 'true' : 'false').appendTo(li)
      $('<span/>').text(item.artifact).appendTo(li)
      $('<span/>').text(item.model).appendTo(li)
    });
  });
}
function getPersons(){
  let search={}
  let dati={}
  let q = $("[name=searchByPersonName]").val();
  if(q){search.filter = q}
  $('#personList .listWrap').html('')
  dati.trigger='getPersons';
  dati.search = search;
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    $('#personList .badge').text(data.length)
    data.forEach((item, i) => {
      let institute = item.institution !== null ? item.institution : 'not present';
      let position = item.position !== null ? item.position : 'not present';
      let li = $("<li/>", {class: 'list-group-item list-group-item-action '}).appendTo('#personList .listWrap');
      $('<a/>', {class:'alert alert-warning p-2 m-0 fs-6 d-block'}).text(item.name).attr("href","person_view.php?person="+item.id).appendTo(li)
      $('<span/>').html("Institution: <strong>"+institute+"</strong>").appendTo(li)
      $('<span/>').html('Position: <strong>'+position+"</strong>").appendTo(li)
      $('<span/>').html("Email: <strong>" +item.email+"</strong>").appendTo(li)
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
      if(data.res = 1){ getInstitutions() }
    })
  }
}