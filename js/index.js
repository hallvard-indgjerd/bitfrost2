//magari non serve!!!
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
} else {
  window.onload = function () { window.scrollTo(0, 0);}
}
/////////////
const byCategory = $("#byCategory");
const byMaterial = $("#byMaterial");
const byChronology = $("#byChronology");
const byDescription = $("#byDescription");
const byInstitution = $("#byInstitution");
const sortBy = $("#sortBy");
let activeFilter = 0;
let cronoData = []
let institutionData = [];
google.charts.load('current', { 'packages':['corechart'],});

$("#createFromFiltered, #resetCollection").hide()

if($("[name=logged]").val() == 0){
  $("#itemTool, #statWrap").addClass('large');
}else{
  $("#itemTool, #statWrap").addClass(checkDevice()=='pc' ? 'small' :'large');
}
currentPageActiveLink('index.php');
getFilterList();
chronoFilter();
buildGallery(gallery);
buildCollection()
buildStat();
artifactByCounty()

screen.orientation.addEventListener("change", resizeDOM);

$(".toggleFilter").on('click', function(){
  $("#filterWrap").toggleClass('d-none d-block')
  $(".toggleFilter").find('span').toggleClass('mdi-chevron-down mdi-chevron-up')
})

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
$("body").on('click', "#macroList .dropdown-item", el => {
  $("#macroList .dropdown-item").removeClass('active');
  $(el.target).addClass('active')
  $("#chronoDropDownBtn").text($(el.target).text())
  getFilter();
})
$("#resetGallery").on('click', function(){
  filter = [];
  filter2 = [];
  sort = "rand()";
  byCategory.val('');
  byMaterial.val('');
  byDescription.val('');
  // byChronology.val('');
  byInstitution.val('');
  $("#macroList .dropdown-item").removeClass('active');
  $("#chronoDropDownBtn").text("chronology")
  activeFilter = 0;
  buildGallery(gallery)
})

$("#createFromFiltered").on('click', function(){
  $(".addItemBtn").trigger('click');
  $(this).hide()
})
$("#resetCollection").on('click', function(){
  collected = [];
  $(".removeItemBtn").hide()
  $(".addItemBtn").show()
  buildCollection()
  checkActiveFilter()
})
$("#viewCollection > span").text('('+collected.length+')')

$("#toggleMenu").on('click',resizeDOM);


$(window).scroll(function(){
  let pos = $(this).scrollTop();
  if(pos > 0){
    if($("#statWrap").hasClass('statWrapVisible')){
      $("#statWrap").removeClass('statWrapVisible').addClass('statWrapHidden')
      $("[name=statToggle").find('span').removeClass('mdi-chevron-left').addClass('mdi-chevron-right')
    }
  }
  if(pos == 0){
    if($("#statWrap").hasClass('statWrapHidden')){
      $("#statWrap").removeClass('statWrapHidden').addClass('statWrapVisible')
      $("[name=statToggle").find('span').removeClass('mdi-chevron-right').addClass('mdi-chevron-left')
    }
  }
});

document.querySelectorAll('button[data-bs-toggle="tab"]').forEach((el)=>{
  el.addEventListener('show.bs.tab', function (event) {
    if(event.target.id == 'viewCollection'){window.scrollTo(0,350)}
  })
})

function institutionChart() {
  var data = google.visualization.arrayToDataTable(institutionData);
  var slices = [];
  for (var i = 0; i < data.getNumberOfRows(); i++) {slices.push({color: data.getValue(i, 2)});}
  var options = {
    title: 'Total artifacts by institution',
    chartArea: {width: '100%', height:'300px'},
    pieHole: 0.4,
    slices:slices,
    width: '100%',
    height:'300px'
  }
  var chart = new google.visualization.PieChart(document.getElementById('institution_chart'));
  chart.draw(data, options);
}

function cronoChart() {
  var data = google.visualization.arrayToDataTable(cronoData);
  var options = {
    title: 'Chronological distribution',
    chartArea: {width: '100%'},
    curveType: 'function',
    legend: { position: 'top' },
    pointsVisible: true,
    width: '100%'
  };
  var chart = new google.visualization.LineChart(document.getElementById('crono_chart'));
  chart.draw(data, options);
}


function getFilter(){
  filter = [];
  filter2 = [];
  let chrono = $("#macroList .dropdown-item.active");
  if(byCategory.val()){
    filter.push("class.id = "+byCategory.val())
    filter2.push({"class.id": "= "+byCategory.val()})
  }
  if(byMaterial.val()){
    filter.push("material.id = "+byMaterial.val())
    filter2.push({"material.id": "= "+byMaterial.val()})
  }
  if (chrono.length > 0) {
    let span = chrono.val().split("|");
    filter.push("artifact.start >= "+span[0]+" and artifact.start < "+span[1])
    filter2.push({"artifact.start": ">= "+span[0], "artifact.start":"< "+span[1]})
  }
  if(byDescription.val()){
    filter.push("(artifact.description like '%"+byDescription.val()+"%' or artifact.name like '%"+byDescription.val()+"%')")
    filter2.push({"description":"(artifact.description like '%"+byDescription.val()+"%' or artifact.name like '%"+byDescription.val()+"%')"})
  }
  if(byInstitution.val()){
    filter.push("artifact.storage_place = "+byInstitution.val())
    filter2.push({"artifact.storage_place":"= "+byInstitution.val()})
  }
  buildGallery(gallery);
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
    data.institution.forEach((item, i) => {
      $("<option/>").text(item.value).val(item.id).appendTo(byInstitution);
    });
  })
}

function checkActiveFilter(){
  filter.length > 0 ? $("#createFromFiltered").show() : $("#createFromFiltered").hide();
}

function buildStat(){
  ajaxSettings.url=API+"stats.php";
  ajaxSettings.data={trigger:'statIndex'};
  $.ajax(ajaxSettings)
  .done(function(data) {
    cronoData.push(['chronology', 'tot'])
    institutionData.push(['Institution', 'Artifact stored', 'color'])
    data.typeChronologicalDistribution.forEach((v) => {cronoData.push([v.crono, v.tot])})
    data.institutionDistribution.forEach((v) => {institutionData.push([v.name, v.tot, v.color])})
    $("#artifactTot > h2").text(data.artifact.tot)
    $("#modelTot > h2").text(data.model.tot)
    $("#institutionTot > h2").text(data.institution.tot)
    $("#filesTot > h2").text(data.files.tot)

    google.charts.setOnLoadCallback(cronoChart);
    google.charts.setOnLoadCallback(institutionChart);
  })
}

function artifactByCounty(){
  ajaxSettings.url=API+"stats.php";
  ajaxSettings.data={
    trigger:'artifactByCounty',
    filter:["artifact.category_class > 0"]
  };
  $.ajax(ajaxSettings).done(function(data) { mapStat(data); })
}

function resizeDOM(){
  if(
    screen.orientation.type.split('-')[0] == 'landscape' &&
    screen.orientation.angle == 0 || screen.orientation.angle == 180
  ){
    map2.remove();
    setTimeout(function() {
      cronoChart()
      institutionChart()
      artifactByCounty()
      }, 500);
  }
}