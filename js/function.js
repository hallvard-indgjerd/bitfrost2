let items = [];
let filter = [];
let sort = "rand()";
$("#collectionDiv").hide();
function buildGallery(){
  $(".card-wrap").html('');
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data={
    trigger:'buildGallery',
    filter:filter,
    sort:sort
  };
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(ajaxSettings.data);
    console.log(data);
    let totItemsTxt;
    if (data.length == 0) {totItemsTxt = 'No items found';}
    if (data.length == 1) {totItemsTxt = 'Only 1 item found';}
    if (data.length > 1) {totItemsTxt = data.length+' items found';}
    $("#totItems").text(totItemsTxt);
    data.forEach((item, i) => {
      let div = $("<div/>",{class:'card m-1 viewArtifactsBtn'}).data("item",item.id).appendTo(".card-wrap");
      $("<div/>", {class:'card-header'})
      .css({"background-image":"url('archive/thumb_256/"+item.thumb_256+"')"})
      .appendTo(div);
      let body = $("<div/>",{class:'card-body'}).appendTo(div);
      let footer = $("<div/>",{class:'card-footer'}).appendTo(div);
      $("<h3/>",{class:'card-title txt-adc-dark fw-bold'}).text(item.category).appendTo(body);
      $("<p/>",{class:'mb-1'}).html("material: <span class='fw-bold'>"+item.material+"</span>").appendTo(body);
      $("<p/>",{class:'mb-2'}).html("chronology: <span class='fw-bold'>"+item.start+" / "+item.end+"</span>").appendTo(body);
      $("<p/>",{class:'mb-2'}).html(cutString(item.description, 100)).appendTo(body);
      let itemUrlBtn = $("<button/>",{class:'btn btn-primary ms-3'}).text('view').appendTo(footer);
      let collectBtn = $("<button/>",{class:'btn btn-primary ms-3 addItemBtn', id: 'addItem'+item.id}).text('collect').appendTo(footer);
      let uncollectBtn = $("<button/>",{class:'btn btn-danger ms-3 removeItemBtn', id: 'removeItem'+item.id}).text('remove').appendTo(footer);
      uncollectBtn.hide();
      collectBtn.on('click',function(){
        items.push(item.id);
        $(this).hide();
        uncollectBtn.show();
        countItems();
      })
      uncollectBtn.on('click',function(){
        let idx = items.findIndex(i => i === item.id);
        items.splice(idx, 1);
        $(this).hide();
        collectBtn.show();
        countItems();
      })
      itemUrlBtn.on('click', function(){
        $.redirectPost('artifact_view.php', {id:item.id});
      })
    })
  })
}

function countItems(){
  items.length > 0 ? $("#collectionDiv").show() : $("#collectionDiv").hide()
  $("#collectedItems").val("collected items: "+items.length)
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
