const dropdownBtnLower = $('#dropdownMenuButtonLower');
const dropdownMenuLower = $('#dropdown-menu-lower');
const dropdownBtnUpper = $('#dropdownMenuButtonUpper');
const dropdownMenuUpper = $('#dropdown-menu-upper');
const startInput = $('#start');
const endInput = $('#end');

async function timelineEditPage(serie) {
  try {
    await getTimeline(serie);
    setRange({filter:'lower', timespanMin: serie.years.start, timespanMax: serie.years.end });
    setRange({filter:'upper', timespanMin: serie.years.start, timespanMax: serie.years.end  });
    setBounds(serie)
  } catch (error) {
    console.error("Errore:", error);
  }
}

function setBounds(serie){
  dropdownBtnLower.text(serie.chrono.start.spec);
  dropdownBtnUpper.text(serie.chrono.end.spec);
  let lowerIdx = null;
  let upperIdx = null;
  $("#dropdown-menu-lower .thirdLevel .dropdown-item").each(function(idx,el){
    if ($(this).text().trim() === serie.chrono.start.spec) {
      lowerIdx = $(this).attr("data-index");
      $(this).addClass('active');
      return false;
    }
  })
  $("#dropdown-menu-upper .thirdLevel .dropdown-item").each(function(idx,el){
    if ($(this).text().trim() === serie.chrono.end.spec) {
      upperIdx = $(this).attr("data-index");
      $(this).addClass('active')
    }
  })
  updateUpperDropdown(parseInt(upperIdx))
}

function getTimeline(serie){
  return new Promise((resolve, reject) => {  
    ajaxSettings.url = API + "get.php";
    ajaxSettings.data = { trigger: 'getTimeSeries', filters: ["macro.serie = " + serie.timeline] };
  
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

      try {
        setRange({ timespanMin, timespanMax });
        setIndex();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  })
}

function setRange(range){
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
  $('#dropdown-menu-upper .dropdown-item').each(function(){
    let idx = $(this).data('index')
    if(idx < selectedIndex){
      $(this).prop('disabled', true)
    }else{
      $(this).prop('disabled', false)
    }
  });
}

function handleChronoChange(){
  let y = parseInt($("#start").val());
  if (y < -3000000 || y > getDate()['y']) {
    alert('Value not allowed. You can fill the field with values beetween -3000000 and '+getDate()['y'])
    resetChronology();
    return false;
  }
  $("#end").attr({"min":y});
}

$("#start").on('change keyup', handleChronoChange)
$("#timeline").on('change', function(){
  let serie = {timeline:$(this).val()}
  getTimeline(serie)
})

$("body").on('click', "#dropdown-menu-lower .dropdown-item", function(){
  let idx = $(this).data('index')
  updateUpperDropdown(idx)
})
$("body").on('click', ".dropdown-item", function(e){e.preventDefault()})