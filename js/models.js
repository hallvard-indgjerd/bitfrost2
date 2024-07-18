const toastToolBar = $('#toastBtn');
const artifact = parseInt($("[name=item]").val())

getArtifactName(artifact)
getModels()

function getArtifactName(item){
  let dati={trigger:'getArtifactName', item:item}
  ajaxSettings.url=API+"artifact.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    $("#title > h3 > span").text(data.name)
  });
}

function getModels(){
  let dati={
    trigger:'getModels', 
    search:{status:0, to_connect:true}
  }
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    if(data.length == 0){
      $("<div/>",{class:'alert alert-danger w-25 text-center m-auto'}).text("sorry but there are no models available").appendTo('#noModelAvailable');
    }
    data.forEach((item, i) => {
      let card = $("<div/>",{class:' card modelCardSmall'}).appendTo('.card-wrap');
      $("<div/>", {class:'thumbDiv card-header'}).css("background-image", "url(archive/thumb/"+item.thumbnail+")").appendTo(card)
      let divDati = $("<div/>",{class:'card-body'}).appendTo(card)
      $("<h6/>",{class:'fw-bold'}).text(item.name).appendTo(divDati)
      // $("<p/>", {class:'m-0'}).text(item.description).appendTo(divDati)
      $("<p/>", {class:'my-1'}).html("<span class='fw-bold me-2'>Author</span><span>"+item.author+"</span>").appendTo(divDati)
      $("<p/>", {class:'my-1'}).html("<span class='fw-bold me-2'>Create at</span><span>"+item.create_at.split(' ')[0]+"</span>").appendTo(divDati)
      let alertClass = item.status_id == 0 ? 'alert-success' : 'alert-danger';
      // $("<div/>", {class:'p-1 m-0 alert '+alertClass, role:'alert'}).text(item.status == 1 ? 'under processing' : 'complete').appendTo(divDati)

      let footer = $("<div/>",{class:'card-footer bg-white border-0'}).appendTo(card);
      let btnConnect = $("<button/>",{'class':'btn btn-sm btn-adc-dark d-block'}).text('connect model').appendTo(footer)
      btnConnect.on('click', function(){
        if(confirm('You are connecting the selected model to artifact, are you sure?')){
          connectModel([artifact,item.id]);
        }
      })
    });
  });
}

function connectModel(items){
  let dati={
    trigger:'connectModel', 
    data:{'artifact':items[0], 'model':items[1]}
  }
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    if (data.res==0) {
      $("#toastDivError .errorOutput").text(data.msg);
      $("#toastDivError").removeClass("d-none");
    }else {
      $(".toastTitle").text(data.msg)
      gotoIndex.appendTo(toastToolBar);
      gotoDashBoard.appendTo(toastToolBar);
      gotoNewItem.text('Back to artifact page').attr("href","artifact_view.php?item="+artifact).appendTo(toastToolBar);
      $("#toastDivSuccess").removeClass("d-none")
    }
    $("#toastDivContent").removeClass('d-none')
  });
}