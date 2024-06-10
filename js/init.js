$(document).ready(function() {
  initNav()
  $("#toggleMenu, #backdrop").on('click', (e) => {
    e.preventDefault();
    toggleNav();
  })
  screen.orientation.addEventListener("change", initNav);
});

function initNav(){
  if($("[name=logged]").val() == 0){
    $("#userMenu").addClass('closed');
    $("body>main").addClass('large');
    switch (checkDevice()) {
      case 'tablet-landscape': $("#toggleMenu").hide(); break;
      case 'tablet-portrait': $("#toggleMenu").show(); break;
      case 'pc': 
        $("#toggleMenu").hide();
        $("#backdrop, #userMenu").remove() 
      break;
      default: $("#toggleMenu").show(); break;
    }
  }else{
    if(checkDevice()=='pc'){
      $("#userMenu").addClass('open');
    }else{
      $("#userMenu").addClass('closed');
    }
    $("body>main").addClass(checkDevice()=='pc' ? 'small' :'large');
    $("#toggleMenu").show()
  }
}
function toggleNav(){
  $("nav").toggleClass('open closed');
  if (
    screen.width < 1368
  ) {
    $("#backdrop").fadeToggle('250');
    ["wheel", "touchmove"].forEach(event => {
      document.getElementById("backdrop").addEventListener(event,  preventScroll, {passive: false});
    })
  }else{
    $(".mainSection").toggleClass('large small')
    // if(document.getElementById("userMenu")){ $(".viewArtifactsBtn").toggleClass('smallCard')}
  }
}
function preventScroll(e){
  e.preventDefault();
  e.stopPropagation();
  return false;
}


function currentPageActiveLink(url){
  $(".headerLink > a").removeClass('currentPage');
  $(".headerLink > a[href='"+url+"']").addClass('currentPage');
}

function getSelectOptions(list, column, filter, select){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data = {trigger:'getSelectOptions',list:list, filter:filter, column:column}
  $.ajax(ajaxSettings)
  .done(function(data) {
    data.forEach((opt, i) => {
      $("<option/>").val(opt.id).text(opt[column]).appendTo("#"+select)
    });
  });
}



function addItemToCollection(id){
  collection.items.push(parseInt(id));
  console.log(collection);
}
function removeItemFromCollection(id){
  console.log(id);
  collection.items.splice(id,1);
  console.log(collection);
}
