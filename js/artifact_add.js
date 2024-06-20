const listTrigger='getSelectOptions';
const citySuggested = $("#citySuggested");
const form = $("[name='newArtifactForm']");
const toastToolBar = $('#toastBtn');
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
  settings: {trigger:listTrigger,list:'material'},
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
map.fitBounds(mapExt)

listArray.push(listCatClass,listMaterial,listStoragePlace,listConservationState,listObjectCondition,listAuthor,listOwner,listLicense, listCounty)
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
  checkName({name:name,element:'artifact'})
})

$('#catSpecsMsg,#cityMsg').hide();
$(document).on('change', '#category_class', handleCategoryChange);
$('[name=resetMap]').on('click',function(e){
  e.preventDefault()
  e.stopPropagation()
  resetMapValue()
});
$("[name=confirmMaterial]").on('click', handleMaterialTechnique)

$("#is_museum_copy").on('click',function(){
  let label = $(this).is(':checked') ? 'yes' : 'no';
  $("label[for='is_museum_copy").text(label)
});

$("#county").on('change', function(){
  $("[name=city]").val('').attr({"data-cityid":''})
  $("#longitude, #latitude").val('')
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

$("[name='newArtifact']").on('click', function(el){ newArtifact(el) })

function checkMaterialArray(){
  const mt = materialTechniqueArray.length
  const mtEl = document.getElementById('material')
  if (mt == 0) {
    alert('You have to add 1 material at least')
    mtEl.setCustomValidity('You have to add 1 material at least')
    return false;
  }else {
    mtEl.setCustomValidity('')
    return true;
  }
}

function newArtifact(el){
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
        $(".toastTitle").text(data.output)
        gotoIndex.appendTo(toastToolBar);
        gotoDashBoard.appendTo(toastToolBar);
        gotoNewItem.attr("href","artifact_view.php?item="+data.id).appendTo(toastToolBar);
        newRecord.appendTo(toastToolBar);
        $("#toastDivSuccess").removeClass("d-none")
      }
      $("#toastDivContent").removeClass('d-none')
    });
  }
}


//chronology section
$("#start").on('change keyup', handleChronoChange)
$("#timeline").on('change', function(){
  let serie = $(this).val()
  getTimeline(serie,setIndex)
})

$("body").on('click', "#dropdown-menu-lower .dropdown-item", function(){
  let idx = $(this).data('index')
  updateUpperDropdown(idx)
})
$("body").on('click', ".dropdown-item", function(e){e.preventDefault()})

function getTimeline(serie,callback){
  const dropdownBtnLower = $('#dropdownMenuButtonLower');
  const dropdownMenuLower = $('#dropdown-menu-lower');
  const dropdownBtnUpper = $('#dropdownMenuButtonUpper');
  const dropdownMenuUpper = $('#dropdown-menu-upper');
  const startInput = $('#start');
  const endInput = $('#end');

  ajaxSettings.url = API + "get.php";
  ajaxSettings.data = { trigger: 'getTimeSeries', filters: ["macro.serie = " + serie] };

  $.ajax(ajaxSettings).done(function(data){
    if(data.length == 0){
      alert('No value available for this timeline!');
      return;
    }

    let timespanMin = Infinity;
    let timespanMax = -Infinity;

    dropdownMenuLower.html('');
    dropdownMenuUpper.html('');

    const macroMap = new Map();
    data.forEach(item => {
      if (!macroMap.has(item.macro_id)) {
        macroMap.set(item.macro_id, {
          definition: item.macro_definition,
          min_start: item.macro_min_start,
          max_end: item.macro_max_end,
          generics: new Map()
        });
      } else {
        const macro = macroMap.get(item.macro_id);
        macro.min_start = Math.min(macro.min_start, item.specific_start);
        macro.max_end = Math.max(macro.max_end, item.specific_end);
      }
      const macro = macroMap.get(item.macro_id);

      if (!macro.generics.has(item.generic_id)) {
        macro.generics.set(item.generic_id, {
          definition: item.generic_definition,
          min_start: item.generic_min_start,
          max_end: item.generic_max_end,
          specifics: []
        });
      } else {
        const generic = macro.generics.get(item.generic_id);
        generic.min_start = Math.min(generic.min_start, item.specific_start);
        generic.max_end = Math.max(generic.max_end, item.specific_end);
      }
      const generic = macro.generics.get(item.generic_id);
      generic.specifics.push({
        definition: item.specific_definition,
        start: item.specific_start,
        end: item.specific_end
      });
    });

    macroMap.forEach((macro, macroId) => {
      timespanMin = Math.min(timespanMin, macro.min_start);
      timespanMax = Math.max(timespanMax, macro.max_end);

      const macroItemLower = $("<li/>");
      const macroItemUpper = $("<li/>");

      macroItemLower.appendTo(dropdownMenuLower);
      macroItemUpper.appendTo(dropdownMenuUpper);

      const macroButtonLower = $("<button/>", { class: 'dropdown-item', 'data-id': macroId })
        .text(macro.definition)
        .appendTo(macroItemLower)
        .on('click', function(){
          dropdownBtnLower.text(macro.definition);
          $("#dropdown-menu-lower .dropdown-item").removeClass('active');
          $(this).addClass('active');
          setRange({filter:'lower', timespanMin: macro.min_start, timespanMax: macro.max_end });
        });

      const macroButtonUpper = $("<button/>", { class: 'dropdown-item', 'data-id': macroId })
        .text(macro.definition)
        .appendTo(macroItemUpper)
        .on('click', function(){
          dropdownBtnUpper.text(macro.definition);
          $("#dropdown-menu-upper .dropdown-item").removeClass('active');
          $(this).addClass('active');
          setRange({filter:'upper', timespanMin: macro.min_start, timespanMax: macro.max_end });
        });

      if(macro.generics.size > 0){
        const genericListLower = $("<ul/>", { class: 'secondLevel' }).appendTo(macroItemLower);
        const genericListUpper = $("<ul/>", { class: 'secondLevel' }).appendTo(macroItemUpper);
        
        macro.generics.forEach((generic, genericId) => {
          timespanMin = Math.min(timespanMin, generic.min_start);
          timespanMax = Math.max(timespanMax, generic.max_end);
          
          const genericItemLower = $("<li/>").appendTo(genericListLower);
          const genericItemUpper = $("<li/>").appendTo(genericListUpper);
          
          const genericButtonLower = $("<button/>", { class: 'dropdown-item', 'data-id': genericId })
            .text(generic.definition)
            .appendTo(genericItemLower)
            .on('click', function(){
              dropdownBtnLower.text(generic.definition);
              $("#dropdown-menu-lower .dropdown-item").removeClass('active');
              $(this).addClass('active');
              setRange({filter:'lower', timespanMin: generic.min_start, timespanMax: generic.max_end });
            });

          const genericButtonUpper = $("<button/>", { class: 'dropdown-item', 'data-id': genericId })
            .text(generic.definition)
            .appendTo(genericItemUpper)
            .on('click', function(){
              dropdownBtnUpper.text(generic.definition);
              $("#dropdown-menu-upper .dropdown-item").removeClass('active');
              $(this).addClass('active');
              setRange({filter:'upper', timespanMin: generic.min_start, timespanMax: generic.max_end });
            });

          if(generic.specifics.length){
            const specificListLower = $("<ul/>", { class: 'thirdLevel' }).appendTo(genericItemLower);
            const specificListUpper = $("<ul/>", { class: 'thirdLevel' }).appendTo(genericItemUpper);
          
            generic.specifics.forEach(specific => {
              const specificItemLower = $("<li/>").appendTo(specificListLower);
              const specificItemUpper = $("<li/>").appendTo(specificListUpper);
          
              $("<button/>", { class: 'dropdown-item', 'data-id': specific.start })
                .text(specific.definition)
                .appendTo(specificItemLower)
                .on('click', function(){
                  dropdownBtnLower.text(specific.definition);
                  $("#dropdown-menu-lower .dropdown-item").removeClass('active');
                  $(this).addClass('active');
                  setRange({filter:'lower', timespanMin: specific.start, timespanMax: specific.end });
                });
                
              $("<button/>", { class: 'dropdown-item', 'data-id': specific.start })
                .text(specific.definition)
                .appendTo(specificItemUpper)
                .on('click', function(){
                  dropdownBtnUpper.text(specific.definition);
                  $("#dropdown-menu-upper .dropdown-item").removeClass('active');
                  $(this).addClass('active');
                  setRange({filter:'upper', timespanMin: specific.start, timespanMax: specific.end });
                });
            });
          }
        });
      }
    });

    dropdownBtnLower.prop('disabled', false);
    dropdownBtnUpper.prop('disabled', false);

    setRange({ timespanMin, timespanMax });
    callback()
  });
}

function setRange(range){
  console.log(range);
  if(range.filter == null || range.filter=='lower'){
    $('#start').attr({'min':range.timespanMin, 'max':range.timespanMax}).val(range.timespanMin);
    $('#end').attr({'min':range.timespanMin, 'max':range.timespanMax}).val(range.timespanMax);
  }
  if(range.filter=='upper'){
    if($("#start").val()){
      $('#end').attr({'max':range.timespanMax}).val(range.timespanMax);
    }else{
      $('#start').attr({'min':range.timespanMin, 'max':range.timespanMax}).val(range.timespanMin);
      $('#end').attr({'min':range.timespanMin, 'max':range.timespanMax}).val(range.timespanMax);
    }
  }
}

function setIndex(){
  $("#dropdown-menu-lower .dropdown-item").each(function(idx, el){
    $(this).attr("data-index",idx);
  })
  $("#dropdown-menu-upper .dropdown-item").each(function(idx, el){
    $(this).attr("data-index",idx);
  })
}

function updateUpperDropdown(selectedIndex){
  console.log(selectedIndex);
  $('#dropdown-menu-upper .dropdown-item').each(function(){
    let idx = $(this).data('index')
    if(idx < selectedIndex){
      $(this).prop('disabled', true)
    }else{
      $(this).prop('disabled', false)
    }
  });
}