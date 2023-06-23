let collected = [];
let filter = [];
let sort = "rand()";
$("#viewCollection, #createFromFiltered").hide();

function buildGallery(){
  checkActiveFilter()
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data={trigger:'buildGallery', filter:filter, sort:sort};
  $.ajax(ajaxSettings)
  .done(function(data) {
    gallery(data,".card-wrap");
    let totItemsTxt;
    if (data.length == 0) {totItemsTxt = 'No items found';}
    if (data.length == 1) {totItemsTxt = 'Only 1 item found';}
    if (data.length > 1) {totItemsTxt = data.length+' items found';}
    $("#totItems").text(totItemsTxt);
  })
}

function countItems(){
  collected.length > 0 ? $("#viewCollection").show() : $("#viewCollection").hide()
}

function getDate(){
  let data = new Date();
  let d = data.getDate();
  let m = data.getMonth() + 1;
  let y = data.getFullYear();
  return {d:d, m:m, y:y}
}

function cutString(string, length) {
    let short = string.substr(0, length);
    if (/^\S/.test(string.substr(length)))
        return short.replace(/\s+\S*$/, "") + '...';
    return short;
};

$.extend({
  redirectPost: function(location, args){
    const form = $('<form></form>');
    form.attr("method", "post");
    form.attr("action", location);
    $.each( args, function( key, value ) {
      let field = $('<input></input>');
      field.attr("type", "hidden");
      field.attr("name", key);
      field.attr("value", value);
      form.append(field);
    });
    $(form).appendTo('body').submit();
  }
});
