const model = $("[name=modelId]").val()
ajaxSettings.url=API+"model.php";

startModel()

// $("#editModelBtn").on('click', editModel)
$("#toggleMenu").on('click', resizeDOM)
$("[name=editModelBtn]").attr("href","model_edit.php?item="+model)
$("[name=deleteModel").on('click', ()=>{
  if(confirm('Deleting model you also delete all related objects and files. Are you sure you want to continue?')){
    deleteModel()
  }
})

$("[name=checkNameBtn]").on('click', function(){
  let name = $("#name").val()
  if(!name){
    alert('The field is empty, enter a value and retry')
    return false;
  }
  if(name.length < 5){
    alert('The name must be 5 characters at least')
    return false;
  }
  checkName({name:name,element:'model'})
})

function resizeDOM(){ setTimeout(function(){ resizeCanvas() }, 500); }

function startModel(){
  ajaxSettings.data={trigger:'getModel', id:model};
  $.ajax(ajaxSettings)
  .done(function(data) {
    initModel(data)
    let modelConnectedText,modelConnectedBtn,modelConnectedBtnHref;
    if(data.artifact){
      modelConnectedText = 'The model is already connected to an artifact'
      modelConnectedBtn = 'go to artifact'
      modelConnectedBtnHref = 'artifact_view.php?item='+data.artifact
    }else{
      modelConnectedText = 'The model is not connected to an artifact'
      modelConnectedBtn = 'connect model'
      modelConnectedBtnHref = 'models.php?item='+data.artifact
    }
    $("#modelConnectedText").text(modelConnectedText)
    $("#modelConnectedBtn").text(modelConnectedBtn).attr("href",modelConnectedBtnHref)
    $("#name").val(data.model.name)
    $("#description").val(data.model.description)
    $("#note").val(data.model.note)
    let status_id, status_label = 'mark model as ';
    $("#status").val(data.model.status_id == 1 ? 2 :1)
    $("label[for=status]").text(data.model.status_id == 1 ? status_label+'complete' : status_label+'under processing')
    $("#loadingDiv,[name=enlargeScreen]").remove()
  });
}




function editModel(e){
  const form = $("#editModelForm")[0];
  if (form.checkValidity()) {
    e.preventDefault();
    let dati = {trigger:'updateModelMetadata', id:model}
    $("[data-table]").each(function(){
      if (!$(this).is(':checkbox')) {
        if($(this).val()){ dati[$(this).attr('id')]=$(this).val(); }
      }else{
        if ($(this).is(':checked')) { dati[$(this).attr('id')]=$(this).val();}
      }
    })
    ajaxSettings.data = dati;
    $.ajax(ajaxSettings)
    .done(function(data) {
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        $("#toastDivSuccess").removeClass("d-none")
        setTimeout(function(){ location.reload(); }, 5000);

      }
      $("#toastDivContent").removeClass('d-none')
    })
  }
}

function deleteModel(){
  let dati = {trigger:'deleteModel', id:model}
  ajaxSettings.data = dati;
  $.ajax(ajaxSettings)
    .done(function(data) {
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        $("#toastDivSuccess").removeClass("d-none")
        setTimeout(function(){ window.location.href='dashboard.php'; }, 5000);

      }
      $("#toastDivContent").removeClass('d-none')
    })
}