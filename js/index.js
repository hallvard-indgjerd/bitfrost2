const byCategory = $("#byCategory");
const byMaterial = $("#byMaterial");
const byChronology = $("#byChronology");
const byDescription = $("#byDescription");
const sortBy = $("#sortBy");
let activeFilter = 0;
let cronoData = [['chronology', 'tot']]
let institutionData = [['Institution', 'Artifact stored']];
google.charts.load('current', { 'packages':['corechart'],});

currentPageActiveLink('index.php');
getFilterList();
buildGallery();
buildStat();

$("[name=statToggle").on('click', function(){
  $("#statWrap").toggleClass('statWrapVisible statWrapHidden')
  $(this).find('span').toggleClass('mdi-chevron-left mdi-chevron-right')
})

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

function institutionChart() {
  var data = google.visualization.arrayToDataTable(institutionData);
  var options = {
    title: 'Total artifacts by institution',
    pieHole: 0.4,
  };
  var chart = new google.visualization.PieChart(document.getElementById('institution_chart'));
  chart.draw(data, options);
}

function cronoChart() {
  var data = google.visualization.arrayToDataTable(cronoData);
  var options = {
    title: 'Chronological distribution',
    curveType: 'function',
    legend: { position: 'bottom' },
    pointsVisible: true
  };
  var chart = new google.visualization.LineChart(document.getElementById('crono_chart'));
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

function collectedGallery(){
  gallery(collected,"#wrapCollected")
}
function checkActiveFilter(){
  filter.length > 0 ? $("#createFromFiltered").show() : $("#createFromFiltered").hide();
}

function buildStat(){
  ajaxSettings.url=API+"stats.php";
  ajaxSettings.data={trigger:'statIndex'};
  $.ajax(ajaxSettings)
  .done(function(data) {
    data.typeChronologicalDistribution.forEach((v) => {cronoData.push([v.crono, v.tot])})
    data.institutionDistribution.forEach((v) => {institutionData.push([v.name, v.tot])})
    $("#artifactTot > h2").text(data.artifact.tot)
    $("#modelTot > h2").text(data.model.tot)
    $("#institutionTot > h2").text(data.institution.tot)
    $("#filesTot > h2").text(data.files.tot)

    google.charts.setOnLoadCallback(cronoChart);
    google.charts.setOnLoadCallback(institutionChart);
    mapStat(data)
  })
}