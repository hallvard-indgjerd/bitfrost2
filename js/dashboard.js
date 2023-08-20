getArtifactDashboardList()

$("[name=artifactStatus]").on('change', getArtifactDashboardList)

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
  console.log(search);
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
    console.log(data);
    $('#artifactList .badge').text(data.length)
    data.forEach((item, i) => {
      let li = $("<a/>", {class: 'list-group-item list-group-item-action'}).attr("href","#").appendTo('#artifactList .listWrap');
      $('<span/>').text(item.id).appendTo(li)
      $('<span/>').text(item.name).appendTo(li)
      $('<span/>').text(item.description).appendTo(li)
      $('<span/>').text(item.last_update).appendTo(li)
      li.on('click', function(e){
        e.preventDefault();
        $.redirectPost('artifact_view.php', {id:item.id});
      })
    });

  });
}
