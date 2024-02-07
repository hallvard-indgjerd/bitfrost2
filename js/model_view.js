const model = $("[name=modelId]").val()
ajaxSettings.url=API+"model.php";
ajaxSettings.data={trigger:'getModel', id:model};

$.ajax(ajaxSettings)
.done(function(data) {
  // console.log(data);
  initModel(data)
  $("#loadingDiv,[name=enlargeScreen]").remove()
});