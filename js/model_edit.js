const model = $("[name=item]").val()
ajaxSettings.url=API+"model.php";

startModel()

$("[name=editModel]").on('click', editModel)

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

function startModel(){
  ajaxSettings.data={trigger:'getModel', id:model};
  $.ajax(ajaxSettings)
  .done(function(data) {
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
        dati[$(this).attr('id')]=$(this).val();
      }else{
        if ($(this).is(':checked')) { 
          dati[$(this).attr('id')]=$(this).val();
        }
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
        setTimeout(function(){ window.location.href="model_view.php?item="+model; }, 3000);

      }
      $("#toastDivContent").removeClass('d-none')
    })
  }
}