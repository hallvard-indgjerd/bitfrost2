const byCategory = $("#byCategory");
const byMaterial = $("#byMaterial");
const byChronology = $("#byChronology");
const byDescription = $("#byDescription");
const sortBy = $("#sortBy");
let activeFilter = 0;
currentPageActiveLink('index.php');
getFilterList();
buildGallery();

$("a.sortBy").on('click', function(){
  sort = $(this).data('sort') + " asc";
  getFilter();
})

$(".buildGallery").on('change', function(){ getFilter(); })
$(".byDescription").on('click', function(){ getFilter(); })
$("#resetGallery").on('click', function(){
  filter = [];
  sort = "rand()";
  byCategory.val('');
  byMaterial.val('');
  byDescription.val('');
  byChronology.val('');
  activeFilter = 0;
  buildGallery()
})

$("#createFromFiltered").on('click', function(){$(".addItemBtn").trigger('click');})

$("[name='viewCollectionBtn']").on('click', collectedGallery)



google.charts.load('current', { 'packages':['geochart', 'corechart'],});
google.charts.setOnLoadCallback(drawRegionsMap);
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawLineChart);

function drawRegionsMap() {
  var data = google.visualization.arrayToDataTable([
    ['Country', 'Popularity'],
    ['Germany', 200],
    ['United States', 300],
    ['Brazil', 400],
    ['Canada', 500],
    ['France', 600],
    ['RU', 700]
  ]);
  var options = {};
  var chart = new google.visualization.GeoChart(document.getElementById('mapStat'));
  chart.draw(data, options);
}

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    title: 'My Daily Activities',
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
}

function drawLineChart() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'Sales', 'Expenses'],
    ['2004',  1000,      400],
    ['2005',  1170,      460],
    ['2006',  660,       1120],
    ['2007',  1030,      540]
  ]);

  var options = {
    title: 'Company Performance',
    curveType: 'function',
    legend: { position: 'bottom' },
    pointsVisible: true
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}


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
    data.category.forEach((item, i) => {
      $("<option/>").text(item.value).val(item.id).appendTo(byCategory);
    });
    data.material.forEach((item, i) => {
      $("<option/>").text(item.value).val(item.id).appendTo(byMaterial);
    });
    data.chronology.forEach((item, i) => {
      $("<option/>").text(item.period).val(item.start+"|"+item.end).appendTo(byChronology);
    });
  })
}

function gallery(data, wrapDiv){
  $("#loadingDiv").remove()
  $(wrapDiv).html('');
  let cardClass = wrapDiv == ".card-wrap" ? 'viewArtifactsBtn' : 'collectedCard';
  data.forEach((item, i) => {
    let div = $("<div/>",{class:'card m-1 '+cardClass}).data("item",item.id).appendTo(wrapDiv);
    $("<div/>", {class:'card-header'})
    .css({"background-image":"url('archive/thumb/"+item.thumbnail+"')"})
    .appendTo(div);
    let body = $("<div/>",{class:'card-body'}).appendTo(div);
    $("<h3/>",{class:'card-title txt-adc-dark fw-bold'}).text(item.category).appendTo(body);
    $("<p/>",{class:'mb-1'}).html("material: <span class='fw-bold'>"+item.material+"</span>").appendTo(body);
    $("<p/>",{class:'mb-2'}).html("chronology: <span class='fw-bold'>"+item.start+" / "+item.end+"</span>").appendTo(body);
    $("<p/>",{class:'mb-2'}).html(cutString(item.description, 100)).appendTo(body);
    let footer = $("<div/>",{class:'card-footer'}).appendTo(div);
    let itemUrlBtn = $("<a/>",{class:'btn btn-primary ms-3', href:'artifact_view.php?item='+item.id}).text('View').appendTo(footer);
    let collectBtn = $("<button/>",{class:'btn btn-primary ms-3 addItemBtn', id: 'addItem'+item.id}).text('Collect').appendTo(footer);
    let uncollectBtn = $("<button/>",{class:'btn btn-danger ms-3 removeItemBtn', id: 'removeItem'+item.id}).text('remove').appendTo(footer);
    wrapDiv == ".card-wrap" ? uncollectBtn.hide() : uncollectBtn.show();
    wrapDiv == ".card-wrap" ? collectBtn.show() : collectBtn.hide();
    collectBtn.on('click',function(){
      collected.push(item);
      $(this).hide();
      uncollectBtn.show();
      countItems();
    })
    uncollectBtn.on('click',function(){
      let idx = collected.findIndex(i => i === item.id);
      collected.splice(idx, 1);
      $(this).hide();
      collectBtn.show();
      countItems();
    })
  })
}

function collectedGallery(){
  gallery(collected,"#wrapCollected")
}
function checkActiveFilter(){
  filter.length > 0 ? $("#createFromFiltered").show() : $("#createFromFiltered").hide();
}
