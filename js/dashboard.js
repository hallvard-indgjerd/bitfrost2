const usrId = $("[name=usrId]").val()
const usrCls = $("[name=usrCls]").val()
getArtifactDashboardList()
getModelDashboardList()

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
    console.log(data);
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
