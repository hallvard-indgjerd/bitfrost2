<?php 
  require 'init.php'; 
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <style>
      ul{padding-left: 0px;}
      li{list-style-type: none;}
      .firstLevel > li > button{padding-left: 10px; font-size:15px;font-weight: bold;}
      .secondLevel > li > button{padding-left: 20px;font-size:13px;}
      .thirdLevel > li > button{padding-left: 30px;font-size:11px;}
      .dropdown-menu{height:auto;max-height: 400px; overflow-y: auto;}
    </style>
  </head>
  <body>
    <!-- <?php print_r(isMobileCheck()); ?> -->
     <?php require("assets/loadingDiv.html"); ?>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-3">
          <label for="serie">select a timeline map</label>
          <select name="serie" id="serie" class="form-select">
            <option value="" disabled selected>-select a timeline-</option>
            <option value="1">generic</option>
            <option value="2">sweden</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="dropdownMenuButtonLower">Lower bound</label>
          <div class="dropdown mb-3">
            <button id="dropdownMenuButtonLower" class="btn btn-light dropdown-toggle form-control text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled>select a period</button>
            <ul class="dropdown-menu firstLevel w-100" aria-labelledby="dropdownMenuButton" id="dropdown-menu-lower"></ul>
          </div>
          <label for="dropdownMenuButtonUpper">Upper bound</label>
          <div class="dropdown">
            <button id="dropdownMenuButtonUpper" class="btn btn-light dropdown-toggle form-control text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled>select a period</button>
            <ul class="dropdown-menu firstLevel w-100" aria-labelledby="dropdownMenuButton" id="dropdown-menu-upper"></ul>
          </div>
        </div>
        <div class="col-md-3">
          <label for="start">From</label>
          <input type="number" class="form-control w-auto mb-3" id="start" step="1" data-table="artifact" value="" min="" max="" required>
          <label for="end">to</label>
          <input type="number" class="form-control w-auto" id="end" step="1" data-table="artifact" value="" min="" max="" required>
        </div>
      </div>
    </div>
    <?php require("assets/js.html"); ?>
    <script>
      $("#serie").on('change', function(){
        let serie = $(this).val()
        getTimeline(serie,setIndex)
      })

      $("body").on('click', "#dropdown-menu-lower .dropdown-item", function(){
        let idx = $(this).data('index')
        updateUpperDropdown(idx)
      })

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
                $(".dropdown-item").removeClass('active');
                $(this).addClass('active');
              });

            const macroButtonUpper = $("<button/>", { class: 'dropdown-item', 'data-id': macroId })
              .text(macro.definition)
              .appendTo(macroItemUpper)
              .on('click', function(){
                dropdownBtnUpper.text(macro.definition);
                $(".dropdown-item").removeClass('active');
                $(this).addClass('active');
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
                    $(".dropdown-item").removeClass('active');
                    $(this).addClass('active');
                  });

                const genericButtonUpper = $("<button/>", { class: 'dropdown-item', 'data-id': genericId })
                  .text(generic.definition)
                  .appendTo(genericItemUpper)
                  .on('click', function(){
                    dropdownBtnUpper.text(generic.definition);
                    $(".dropdown-item").removeClass('active');
                    $(this).addClass('active');
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
                        $(".dropdown-item").removeClass('active');
                        $(this).addClass('active');
                      });
                      
                    $("<button/>", { class: 'dropdown-item', 'data-id': specific.start })
                      .text(specific.definition)
                      .appendTo(specificItemUpper)
                      .on('click', function(){
                        dropdownBtnUpper.text(specific.definition);
                        $(".dropdown-item").removeClass('active');
                        $(this).addClass('active');
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
        $('#start').attr({'min':range.timespanMin, 'max':range.timespanMax}).val(range.timespanMin);
        $('#end').attr({'min':range.timespanMin, 'max':range.timespanMax}).val(range.timespanMax);
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
    </script>
  </body>
</html>


