const byCategory = $("#byCategory");
const byMaterial = $("#byMaterial");
const byChronology = $("#byChronology");
const byDescription = $("#byDescription");
const sortBy = $("#sortBy");
currentPageActiveLink('index.php');
getFilterList();
buildGallery();

$("a.sortBy").on('click', function(){
  sort = $(this).data('sort') + " asc";
  getFilter();
})

$(".buildGallery").on('click', function(){ getFilter(); })
$("#resetGallery").on('click', function(){
  filter = [];
  sort = "rand()";
  byCategory.val('');
  byMaterial.val('');
  byDescription.val('');
  byChronology.val('');
  buildGallery()
})
function getFilter(){
  filter = [];
  if(byCategory.val()){filter.push("class.id = "+byCategory.val())}
  if(byMaterial.val()){filter.push("material.id = "+byMaterial.val())}
  if(byChronology.val()){
    let span = byChronology.val().split("|");
    filter.push("artifact.start >= "+span[0]+" and artifact.start < "+span[1])
  }
  if(byDescription.val()){filter.push("artifact.description like '%"+byDescription.val()+"%'")}
  buildGallery();
}
function getFilterList(){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data={trigger:'getFilterList'};
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(data.chronology);
    data.category.forEach((item, i) => {
      $("<option/>").text(item.value + " ("+item.tot+")").val(item.id).appendTo(byCategory);
    });
    data.material.forEach((item, i) => {
      $("<option/>").text(item.value + " ("+item.tot+")").val(item.id).appendTo(byMaterial);
    });
    data.chronology.forEach((item, i) => {
      $("<option/>").text(item.period + " ("+item.tot+")").val(item.start+"|"+item.end).appendTo(byChronology);
    });

  })
}
