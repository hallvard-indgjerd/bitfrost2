const usrId = $("[name=usrId]").val()
const usrCls = $("[name=usrCls]").val()
getArtifactDashboardList()
getModelDashboardList()
getInstitutionDashboardList()
getPersonDashboardList()

$("#modelDashboardGallery").css("height",$(".listDashBoard").height())

$("[name=artifactStatus]").on('change', getArtifactDashboardList)
$("[name=modelStatus]").on('change', getModelDashboardList)

$("[name=searchByDescriptionBtn]").on('click', function(){
  let q = $("[name=searchByDescription]").val()
  if(q.length < 3){
    alert('You have to enter 3 characters at least')
    return false;
  }
  getArtifactDashboardList()
  $("[name=resetDescriptionBtn]").removeClass('d-none');
})
$("[name=resetDescriptionBtn]").on('click', function(e){
  $("[name=searchByDescription]").val('');
  getArtifactDashboardList()
  $(this).addClass('d-none')
})

function getArtifactDashboardList(){
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
  dati.trigger='getArtifactDashboardList';
  dati.search = search;
  ajaxSettings.url=API+"artifact.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    $('#artifactList .badge').text(data.length)
    data.forEach((item, i) => {
      let li = $("<a/>", {class: 'list-group-item list-group-item-action'}).attr("href","artifact_view.php?item="+item.id).appendTo('#artifactList .listWrap');
      $('<span/>').text(item.id).appendTo(li)
      $('<span/>').text(item.name).appendTo(li)
      $('<span/>').text(item.description).appendTo(li)
      $('<span/>').text(item.last_update).appendTo(li)
    });
  });
}

function getModelDashboardList(){
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
  dati.trigger='getModelDashboardList';
  dati.search = search;
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    $('#modelList .badge').text(data.length)
    data.forEach((item, i) => {
      let card = $("<div/>",{class:' card modelCardSmall'}).appendTo(cardWrap);
      let img = $("<div/>", {class:'thumbDiv card-header'}).css("background-image", "url(archive/thumb_256/"+item.thumb+")").appendTo(card)
      let divDati = $("<div/>",{class:'card-body'}).appendTo(card)
      $("<p/>", {class:'m-0'}).text(item.description).appendTo(divDati)
      if(usrCls < 4){
        $("<p/>", {class:'my-1'}).html("<span class='fw-bold me-2'>Author</span><span>"+item.name+"</span>").appendTo(divDati)
      }
      $("<p/>", {class:'mt-1'}).html("<span class='fw-bold me-2'>Last update</span><span>"+item.updated_at+"</span>").appendTo(divDati)

      let footer = $("<div/>",{class:'card-footer'}).appendTo(card);
      $("<a/>",{class:'btn btn-sm btn-adc-dark', href:'model_view.php?model='+item.id}).text('edit model').appendTo(footer)
    });
  });
}

function getInstitutionDashboardList(){
  let dati={}
  let cardWrap = $("#institutionDasboardList");
  $("#modelStatusTitle").text(txt);
  cardWrap.html('')
  dati.trigger='getInstitutionDashboardList';
  ajaxSettings.url=API+"institution.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    console.log(data);
    $('#institutionList .badge').text(data.length)
    data.forEach((item, i) => {
      let card = $("<div/>",{class:"card mb-3"}).appendTo(cardWrap)
      let row = $("<div/>", {class:'row g-0'}).appendTo(card)
      let col1 = $("<div/>", {class:'col-md-4 bg-success text-center'}).appendTo(row)
      $("<span/>",{class:"mdi mdi-camera font text-white"}).css("font-size", "60px").appendTo(col1)
      let col2 = $("<div/>", {class:'col-md-8'}).appendTo(row)
      let body =$("<div/>",{class:'card-body'}).appendTo(col2)
      $("<h5/>",{class:'card-title fw-bold'}).text(item.name+" ("+item.abbreviation+")").appendTo(body)
      $("<a/>",{href:'http://maps.google.com/maps?q='+item.name.replace(/ /g,"+"), title:'view on Google Maps', target:'_blank', class:'card-link d-block'}).html('<i class="mdi mdi-map-marker"></i> '+item.address).appendTo(body)
      $("<a/>",{href:item.link, title:'Official Webpage', target:'_blank', class:'card-link d-block m-0'}).html('<i class="mdi mdi-link-variant"></i> '+item.link).appendTo(body)
      $("<p/>",{class:'card-text m-0'}).text("Number of artifact stored by Institute: "+item.artifact).appendTo(body)
    });
  });
}

function getPersonDashboardList(){
  let search={}
  let dati={}
  $('#artifactList .listWrap').html('')
  dati.trigger='getPersonDashboardList';
  dati.search = search;
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    $('#personList .badge').text(data.length)
    data.forEach((item, i) => {
      let li = $("<a/>", {class: 'list-group-item list-group-item-action'}).attr("href","person_view.php?person="+item.id).appendTo('#personList .listWrap');
      $('<span/>').text(item.name).appendTo(li)
      $('<span/>').text(item.role).appendTo(li)
      $('<span/>').text(item.is_active == 1 ? 'true' : 'false').appendTo(li)
      $('<span/>').text(item.artifact).appendTo(li)
      $('<span/>').text(item.model).appendTo(li)
    });
  });
}
