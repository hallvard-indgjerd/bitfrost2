$(document).ready(function() {
  initNav()
  $("#toggleMenu, #backdrop").on('click', (e) => {
    e.preventDefault();
    toggleNav();
  })
});

function initNav(){
  let nav = $("nav");
  let initNav = screen.width >= 992 ? 'open' : 'close';
  nav.addClass(initNav)
}
function toggleNav(){
  $("#backdrop").fadeToggle('250');
  $("nav").toggleClass('open close');
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
