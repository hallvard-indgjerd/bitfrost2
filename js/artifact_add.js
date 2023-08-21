const listTrigger='getSelectOptions';
const citySuggested = $("#citySuggested");
const form = $("[name='newArtifactForm']");
let dati={}
let tab=[]
let field=[]
let val=[]
let autocompleted = false;
let materialTechniqueArray = []
let listArray = [];
let listCatClass = {
  settings:{trigger:listTrigger,list:'list_category_class'},
  htmlEl: 'category_class',
  label: 'value'
}
let listMaterial = {
  settings: {trigger:listTrigger,list:'list_material_class'},
  htmlEl: 'material',
  label: 'value'
}
let chronoGeneric ={
  settings: {trigger:listTrigger,list:'cultural_generic_period',orderBy:'id'},
  htmlEl: 'startGenericList',
  label: 'definition'
}
let chronoSpecific ={
  settings: {trigger:listTrigger,list:'cultural_specific_period',orderBy:'id'},
  htmlEl: '',
  label: 'definition'
}
let listStoragePlace = {
  settings: {trigger:listTrigger, list:'institution', orderBy:'name'},
  htmlEl: 'storage_place',
  label: 'value'
}
let listConservationState = {
  settings: {trigger:listTrigger, list:'list_conservation_state', orderBy:'id'},
  htmlEl: 'conservation_state',
  label: 'value'
}
let listObjectCondition = {
  settings: {trigger:listTrigger, list:'list_object_condition', orderBy:'value'},
  htmlEl: 'object_condition',
  label: 'value'
}
let listAuthor = {
  settings: {trigger:listTrigger, list:'user', orderBy:'name'},
  htmlEl: 'author',
  label: 'name'
}
let listOwner = {
  settings: {trigger:listTrigger, list:'institution', orderBy:'name'},
  htmlEl: 'owner',
  label: 'value'
}
let listLicense = {
  settings: {trigger:listTrigger, list:'license', orderBy:'name'},
  htmlEl: 'license',
  label: 'name'
}
let listCounty = {
  settings: {trigger:listTrigger, list:'county', orderBy:'name', filter:''},
  htmlEl: 'county',
  label: 'name'
}
let listCity = {
  settings: {trigger:listTrigger, list:'city', orderBy:'name', filter:''},
  htmlEl: 'city',
  label: 'name'
}
let jsonCity = {
  settings: {trigger:listTrigger, list:'', orderBy:'1', filter:''},
}
citySuggested.hide()
$("#resetMapDiv").hide();
mapInit()

listArray.push(listCatClass,listMaterial,chronoGeneric,listStoragePlace,listConservationState,listObjectCondition,listAuthor,listOwner,listLicense, listCounty)
listArray.forEach((item, i) => {getList(item.settings,item.htmlEl,item.label)});

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
  checkName(name)
})

function checkName(name){
  dati.trigger='checkName';
  dati.name = name;
  ajaxSettings.url=API+"artifact.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    let output = data.length==0 ? '<div class="alert alert-success">Ok, the value is not present in the database, you can use this name</div>':'<div class="alert alert-danger">The value already exists in the database, you cannot use it</div>';
    $("#checkNameResult").html(output);
  });
}

$('#catSpecsMsg,#cityMsg').hide();
$(document).on('change', '#category_class', handleCategoryChange);
$('[name=resetMap]').on('click',function(e){
  e.preventDefault()
  e.stopPropagation()
  resetMapValue()
});
$("[name=confirmMaterial]").on('click', handleMaterialTechnique)

$("#county").on('change', function(){
  $("[name=city]").val('').attr({"data-cityid":''})
  setMapExtent('jsonCounty',$(this).val())
  $("#resetMapDiv").show();
})

$("[name=city]").on({
  keyup: function(){
    let v = $(this).val()
    if(v.length >= 2){
      getCity(v)
    }else{
      citySuggested.html('').fadeOut('fast')
    }
  }
})

$(document).on('click', (event) => {
  if(!$(event.target).closest('#citySuggested').length &&
  $('#citySuggested').is(":visible")) {
    let city = $("[name=city]").val()
    $('#citySuggested').fadeOut('fast');
    if(city && !autocompleted){
      $("[name=city]").val('').attr({"data-cityid":''})
    }
  }
})

$("[name='newArtifact']").on('click', function(el){
  checkMaterialArray()
  if (form[0].checkValidity()) {
    el.preventDefault()
    buildData()
    dati.trigger = 'addArtifact';
    dati.artifact_material_technique = materialTechniqueArray;
    if ($("#city").val()) {
      dati.artifact_findplace.city = $("#city").data('cityid')
    }
    ajaxSettings.url=API+"artifact.php";
    ajaxSettings.data = dati
    $.ajax(ajaxSettings)
    .done(function(data) {
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $("#toastDivSuccess").removeClass("d-none")
        $("#toastDivSuccess #createNewRecord").attr("href","artifacts_add.php")
        $("#toastDivSuccess #goToItemPage").attr("href","artifact_view.php?item="+data.id)
      }
      $("#toastDivContent").removeClass('d-none')
    });
  }
})

function checkMaterialArray(){
  const mt = materialTechniqueArray.length
  const mtEl = document.getElementById('material')
  if (mt == 0) {
    mtEl.setCustomValidity('You have to add 1 material at least')
    return false;
  }else {
    mtEl.setCustomValidity('')
    return true;
  }
}
