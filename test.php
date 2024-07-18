<?php 
  require 'init.php'; 
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <style>
      .dropdown-menu li {position: relative;}
      .dropdown-menu .dropdown-submenu {display: none;position: absolute;left: 100%;top: -7px; width:200px;}
      .dropdown-menu .dropdown-submenu-left {right: 100%;left: auto;}
      .dropdown-menu > li:hover > .dropdown-submenu {display: block;}
    </style>
  </head>
  <body>
    <!-- <?php print_r(isMobileCheck()); ?> -->
     <div class="container">
      <div class="row">
        <div class="col">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" id="chronoDropDownBtn" data-bs-toggle="dropdown" aria-expanded="false">chronology</button>
            <ul id="macroList" class="dropdown-menu"></ul>
          </div>
        </div>
        <div class="col">
          <button type="button" class="btn btn-secondary" id="reset">reset</button>
        </div>
      </div>
     </div>
    
    <?php require("assets/js.html"); ?>
    <script>
      $("body").on('click', "#macroList .dropdown-item", el => {
        $("#macroList .dropdown-item").removeClass('active');
        $(el.target).addClass('active')
        $("#chronoDropDownBtn").text($(el.target).text())
        testFilter()
      })

      $("#reset").on('click', ()=>{
        $("#macroList .dropdown-item").removeClass('active');
        $("#chronoDropDownBtn").text("chronology")
      })

      function testFilter(){
        let activeItem = $("#macroList .dropdown-item.active");
        if (activeItem.length > 0) {
          let val = activeItem.val();
          console.log(val);
        }
      }

      ajaxSettings.url=API+"artifact.php";
      ajaxSettings.data={trigger:'testChronoHome'};
      $.ajax(ajaxSettings).done(function(data) {
        data.macro.forEach(macro => {
          let macroLi = $("<li/>").appendTo("#macroList")
          let macroBtn = $("<button/>", {class:'dropdown-item'}).html(macro.definition + '<span class="mdi mdi-chevron-right float-end"></span>').val(macro.start+"|"+macro.end).appendTo(macroLi)
          let genericSubMenu = $("<ul/>", {class:'dropdown-menu dropdown-submenu'}).appendTo(macroLi)
          macro.generic.forEach(generic => {
            let genericLi = $("<li/>").appendTo(genericSubMenu)
            let genericBtn = $("<button/>", {class:'dropdown-item'}).html(generic.definition + '<span class="mdi mdi-chevron-right float-end"></span>').val(generic.start+"|"+generic.end).appendTo(genericLi)
            let specificSubMenu = $("<ul/>", {class:'dropdown-menu dropdown-submenu'}).appendTo(genericLi)
            generic.specific.forEach(specific => {
              if(generic.definition !== specific.definition){
                let specificLi = $("<li/>").appendTo(specificSubMenu)
                let specificBtn = $("<button/>", {class:'dropdown-item'}).html(specific.definition).val(specific.start+"|"+specific.end).appendTo(specificLi)
              }else{
                specificSubMenu.remove()
                genericBtn.find('span').remove();
              }
            })
          })
        });
      })
    </script>
  </body>
</html>


