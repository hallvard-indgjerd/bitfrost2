const loader = $("#loadingDiv").length; 
let ajaxCallsCompleted = true;
let pageLoaded = false;
let domContentLoaded = false;

function checkAllCompleted() {
  if (ajaxCallsCompleted && pageLoaded && domContentLoaded && loader > 0) {
    //Tutte le chiamate AJAX sono completate, la pagina è completamente caricata e il DOM è pronto
    $("#loadingDiv").fadeOut('fast')
  }else{
    $("#loadingDiv").show()
  }
}


$(document).ajaxStart(function () {
  ajaxCallsCompleted = false;
  checkAllCompleted();
});

$(document).ajaxStop(function() {
  ajaxCallsCompleted = true;
  checkAllCompleted();
});

$(document).ready(function() {
  domContentLoaded = true;
  checkAllCompleted();
});

$(window).on('load', function() {
  pageLoaded = true;
  checkAllCompleted();
});


let btnHome, btnFullscreen;
let collected = [];
let filter = [];
let filter2 = [];
let sort = "rand()";

function buildCollection(){
  let wrap = $("#wrapCollection");
  $("#viewCollection > span").text('('+collected.length+')')
  wrap.html('')
  if (collected.length === 0) {
    $("#resetCollection").hide()
    $("#fullCollection").hide()
    $("#emptyCollection").show()
    return false;
  }
  $("#resetCollection").show()
  $("#fullCollection").show()
  $("#emptyCollection").hide()
  collected.forEach((item)=>{
    let div = $("<div/>",{class:'card m-1 itemCard'}).attr("data-item",item.id).appendTo(wrap);
    $("<div/>", {class:'card-header'})
    .css({"background-image":"url('archive/thumb/"+item.thumbnail+"')"})
    .appendTo(div);
    let body = $("<div/>",{class:'card-body'}).appendTo(div);
    $("<h3/>",{class:'card-title txt-adc-dark fw-bold'}).text(item.category).appendTo(body);
    $("<p/>",{class:'mb-1'}).html("material: <span class='fw-bold'>"+item.material+"</span>").appendTo(body);
    $("<p/>",{class:'mb-2'}).html("chronology: <span class='fw-bold'>"+item.start+" / "+item.end+"</span>").appendTo(body);
    $("<p/>",{class:'mb-2'}).html(cutString(item.description, 80)).appendTo(body);
    let footer = $("<div/>",{class:'card-footer'}).appendTo(div);
    $("<a/>",{class:'btn btn-sm btn-adc-blue ms-3', href:'artifact_view.php?item='+item.id}).text('View').appendTo(footer);
    let uncollectBtn = $("<button/>",{class:'btn btn-sm btn-danger ms-3'}).text('Remove').appendTo(footer);

    uncollectBtn.on('click',function(){
        let idx = collected.findIndex(i => i.id === item.id);
        collected.splice(idx, 1);
        div.remove()
        $("#wrapGallery").find('#addItem'+item.id).show()
        $("#wrapGallery").find('#removeItem'+item.id).hide()
        buildCollection()
        console.log(collected);
    })
  })
}

function buildData(){
  $("[data-table]").each(function(){
    if ($(this).is("input:text") ||
      $(this).is("input[type=number]") ||
      $(this).is("select") ||
      $(this).is("textarea")
    ) {
      if (!$(this).is(':disabled')) {
        if ($(this).val()) {
          tab.push($(this).data('table'));
          field.push({tab:$(this).data('table'),field:$(this).attr('id')});
          val.push({tab:$(this).data('table'),field:$(this).attr('id'),val:$(this).val()});
        }
      }
    }
    if ($(this).is(':checkbox')) {
      let v = $(this).is(':checked') ? 1 : 0;
      tab.push($(this).data('table'));
      field.push({tab:$(this).data('table'),field:$(this).attr('id')});
      val.push({tab:$(this).data('table'),field:$(this).attr('id'),val:v});
    }
  });
  tab = tab.filter((v, p) => tab.indexOf(v) == p);
  $.each(tab,function(i,v){ dati[v]={} })
  $.each(field,function(i,v){ dati[v.tab][v.field]={} })
  $.each(val,function(i,v){ dati[v.tab][v.field]=v.val })
}

function buildGallery(callback){
  checkActiveFilter()
  ajaxSettings.url=API+"model.php";
  ajaxSettings.data={trigger:'buildGallery', filter:filter2, sort:sort};
  $.ajax(ajaxSettings).done(callback)
}

function checkDevice(){
  let device;

  if(
    screen.width >= 1024 &&
    screen.orientation.type.split('-')[0] == 'landscape' &&
    (screen.orientation.angle == 90 || screen.orientation.angle == 270)
  ){device = 'tablet-landscape'}
  
  if(//tablet and hybrid laptop (ex. surface pro), portrait
    (screen.width >= 768 && screen.width < 1024) &&
    screen.orientation.type.split('-')[0] == 'portrait' &&
    (screen.orientation.angle == 0 || screen.orientation.angle == 180)
  ){device = 'tablet-portrait'}

  if(//laptop and desktop
    screen.width >= 1024 &&
    screen.orientation.type.split('-')[0] == 'landscape' &&
    (screen.orientation.angle == 0 || screen.orientation.angle == 180)
  ){device='pc'}
  return device;
}

function checkName(data){
  let dati = {}
  dati.trigger='checkName';
  dati.name = data.name;
  dati.element = data.element;
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    let output = data.length==0 ? '<div class="alert alert-success">Ok, the value is not present in the database, you can use this name</div>':'<div class="alert alert-danger">The value already exists in the database, you cannot use it</div>';
    $("#checkNameResult").html(output);
  });
}



function cutString(string, length) {
  let short = string.substr(0, length);
  if (/^\S/.test(string.substr(length)))
  return short.replace(/\s+\S*$/, "") + '...';
  return short;
}

function el(el){return document.getElementById(el);}

function generateRandomPassword(){
  ajaxSettings.url=API+'user.php';
  ajaxSettings.data = {trigger:'genPwd'};
  $.ajax(ajaxSettings)
  .done(function(data){
    $("#toggle-pwd > i").removeClass('mdi-eye').addClass('mdi-eye-off')
    $(".pwd").attr("type",'text')
    $("#new_pwd, #confirm_pwd").val(data)
    getPwdStrength()
  });
}

function gallery(data){
  console.log(data);
  wrapDiv = "#wrapGallery";
  $(wrapDiv).html('');
  $("#viewGallery > span").text('('+data.length+')')
  data.forEach((item) => {
    var materialObject = JSON.parse(item.material);
    var materialValues = [];
    for (var key in materialObject) {
      if (materialObject.hasOwnProperty(key)) {
          materialValues.push(materialObject[key]);
      }
    }
    let div = $("<div/>",{class:'card m-1 itemCard'}).attr("data-item",item.id).appendTo(wrapDiv);
    let header = $("<div/>", {class:'card-header'})
    .css({"background-image":"url('archive/thumb/"+item.thumbnail+"')"})
    .appendTo(div);
    $("<p/>",{class:'txt-adc-dark fw-bold'}).html(item.id).appendTo(header);
    let body = $("<div/>",{class:'card-body'}).appendTo(div);
    $("<h3/>",{class:'card-title txt-adc-dark fw-bold'}).text(item.category).appendTo(body);
    $("<p/>",{class:'mb-1'}).html("material: <span class='fw-bold'>"+materialValues.join(', ')+"</span>").appendTo(body);
    $("<p/>",{class:'mb-2'}).html("chronology: <span class='fw-bold'>"+item.start+" / "+item.end+"</span>").appendTo(body);
    $("<p/>",{class:'mb-2'}).html(cutString(item.description, 80)).appendTo(body);
    let footer = $("<div/>",{class:'card-footer'}).appendTo(div);
    $("<a/>",{class:'btn btn-sm btn-adc-blue ms-3', href:'artifact_view.php?item='+item.id}).text('View').appendTo(footer);
    let collectBtn = $("<button/>",{class:'btn btn-sm btn-adc-blue ms-3 addItemBtn', id: 'addItem'+item.id}).text('Collect').appendTo(footer);
    let uncollectBtn = $("<button/>",{class:'btn btn-sm btn-danger ms-3 removeItemBtn', id: 'removeItem'+item.id}).text('Remove').appendTo(footer).hide();

    collectBtn.on('click',function(){
      if(!collected.includes(item)){
        collected.push(item);
        $(this).hide();
        uncollectBtn.show();
        buildCollection();
      }
    })

    uncollectBtn.on('click',function(){
      let idx = collected.findIndex(i => i.id === item.id);
      collected.splice(idx, 1);
      $(this).hide();
      collectBtn.show();
      buildCollection();
    })
  })
}

function getCity(query){
  let county='';
  if($("#county").length){
    let countyVal = $("#county").val();
    county = countyVal ? ' county = '+countyVal+' and ': ' ';
  }
  ajaxSettings.url=API+"get.php";
  listCity.settings.filter = county+"name like '%"+query+"%'"
  ajaxSettings.data=listCity.settings;
  $.ajax(ajaxSettings)
  .done(function(data){
    citySuggested.html('')
    if(data.length == 0){
      $("<button/>", {class:'list-group-item list-group-item-action', type:'button'}).prop('disabled', true).text('No cities found').appendTo(citySuggested)
    }else {
      data.forEach((item, i) => {
        let cityBtn = $("<button/>", {class:'list-group-item list-group-item-action', type:'button'}).text(item.name).appendTo(citySuggested)
        cityBtn.on('click', function(){
          if($("#county").length && !$("#county").val()){
            $("#county").val(item.county).trigger('change');
          }
          $("[name=city]").val(item.name).attr({"data-cityId":item.id})
          $('#citySuggested').fadeOut('fast');
          autocompleted = true;
          setMapExtent('jsonCity',item.id)
        })
      });
    }
    citySuggested.fadeIn('fast')
  });
}

function getCityFromLonLat(ll, zoom){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data={trigger: 'getCityFromLonLat', point:ll};
  $.ajax(ajaxSettings)
  .done(function(data) {
    if(data.length==0){
      $("#mapAlert")
        .removeClass()
        .addClass('alert alert-danger')
        .text('Attention! You clicked out of the project area!')
      return false;
    }
    if (marker != undefined) { map.removeLayer(marker)};
    marker = L.marker([ll[1], ll[0]]).addTo(map);
    if($("#county").length){ $("#county").val(data[0].county).trigger('change'); }
    $("[name=city]").val(data[0].name).attr({"data-cityId":data[0].id})
    $("#longitude").val(ll[0].toFixed(4));
    $("#latitude").val(ll[1].toFixed(4));
    setMapExtent('jsonCity',data[0].id)
  })

  //reverse address geocoding
  if($("#address").length){
    let geoapi = nominatimReverse+'lat='+ll[1]+'&lon='+ll[0];
    $.getJSON( geoapi, function( data ) {
      let addr = data.address.road;
      if(data.address.house_number && data.address.house_number !== 'undefined'){
        addr = addr+" "+data.address.house_number;
      }
      $("#address").val(addr)
    });
  }
}

function getDate(){
  let data = new Date();
  let d = data.getDate();
  let m = data.getMonth() + 1;
  let y = data.getFullYear();
  return {d:d, m:m, y:y}
}

function getList(settings,selName,label){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data=settings;
  $.ajax(ajaxSettings)
  .done(function(data) {
    if(selName=='material'){
      data.class.forEach((opt) => { $("<option/>").val(opt.id).text(opt[label]).appendTo("#material>#matClass")});
      data.specs.forEach((opt) => { $("<option/>").val(opt.id).text(opt[label]).appendTo("#material>#matSpecs")});
      return false;
    }
    data.forEach((opt, i) => {
      let item = $("<option/>").val(opt.id).text(opt[label]).appendTo("#"+selName)
      if(selName=='startGenericList' || selName=='startSpecificList' || selName=='endGenericList' || selName=='endSpecificList'){
        item.attr({"data-start":opt.start, "data-end":opt.end})
      }
      if (selName == 'author') {
        let auth = $("[name=usr]").val()
        $("#author").val(auth)
      }
    });
  })
}

function getPwdStrength(){
  const pwdVal = document.getElementById("new_pwd").value;
  let result = zxcvbn(pwdVal);  
  document.getElementById("password-strength").className = "strength-" + result.score;
  document.getElementById("pwdMsg").innerHTML = getPwdMsg(result.score)
}

function getPwdMsg(score){
  let msg='';
  switch (score) {
    case 0: msg = 'too weak'; break;
    case 1: msg = 'very weak'; break;
    case 2: msg = 'moderately weak'; break;
    case 3: msg = 'fairly strong'; break;
    case 4: msg = 'very strong'; break;
    default: msg = ''; break;
  }
  return msg;
}

function handleCategoryChange(){
  $("#category_specs").html('<option value="" selected>-- select a value --</option>').prop('disabled', false);
  let val = $('#category_class').val();
  getList({trigger:listTrigger, list:'list_category_specs',column:'value', filter:'category_class = '+val},'category_specs', 'value');
  let showMsgList = function(){
    $("#category_specs option").length == 1 ? $("#catSpecsMsg").fadeIn('fast') : $("#catSpecsMsg").hide();
  }
  setTimeout(showMsgList, 500)
}

function chronoFilter(){
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data={trigger:'chronoFilter'};
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
}

function handleChronoChange(){
  let y = parseInt($("#start").val());
  if (y < -3000000 || y > getDate()['y']) {
    alert('Value not allowed. You can fill the field with values beetween -3000000 and '+getDate()['y'])
    resetChronology();
    return false;
  }
  $("#end").attr({"min":y});
}

function handleMaterialTechnique(){
  let m = parseInt($("#material").val())
  let matTxt = $("#material option:selected").text()
  let t = $("#technique").val() ? $("#technique").val() : null;
  if (!m) {
    alert("You must select a material from list at least");
    return false;
  }
  let checkM = materialTechniqueArray.some(( materialTechniqueArray ) => materialTechniqueArray.m == m);
  if (checkM) {
    alert("The value "+matTxt+" is already in the list");
    return false;
  }
  materialTechniqueArray.push({m, t});
  $("#material, #technique").val('')
  let row = $("<div/>", {class:'row wrapfield mb-3'}).appendTo("#matTechArray");
  let matDiv = $("<div/>", {class:'material'}).appendTo(row);
  let techDiv = $("<div/>", {class:'technique'}).appendTo(row);
  $("<input/>", {class:'form-control', type:'text'}).prop('readonly', true).val(matTxt).appendTo(matDiv);
  let iptGrp = $("<div/>", {class:'input-group'}).appendTo(techDiv)
  $("<input/>", {class:'form-control', type:'text'}).prop('readonly', true).val(t).appendTo(iptGrp);
  $("<button/>",{class:'btn btn-danger', type:'button', name:'delRow', title:'delete row'})
    .attr({"data-bs-toggle":'tooltip'})
    .html('<span class="mdi mdi-trash-can"></span>')
    .appendTo(iptGrp)
    .on('click', function(){
      let idx = $("#matTechArray .row").index(row);
      materialTechniqueArray.splice(idx,1)
      row.remove();
      $(this).tooltip('hide')
    })
    .tooltip()
}

function nl2br(str){return str.replace(/(?:\r\n|\r|\n)/g, '<br>');}

function resetChronology(){
  $("#start, #end, #startGenericList, #startSpecificList,#endGenericList, #endSpecificList").val('')
  $("#start, #end").attr({"min":-3000000,"max":getDate()['y']});
}

function resetMapValue(){
  map.fitBounds(mapExt);
  map.removeLayer(countyGroup);
  map.removeLayer(cityGroup);
  countyGroup = L.featureGroup()
  cityGroup = L.featureGroup()
  map.eachLayer(function (layer) { if (layer instanceof L.Marker) { layer.remove() } });
  $("#county, #parish, #toponym, #longitude, #latitude, #findplace_notes").val('')
  $("[name=city]").val('').attr({"data-cityid":''})
  $("#resetMapDiv").show();
}

function setMapExtent(group, id){
  let countyJson, cityJson;
  jsonCity.settings.list = group;
  jsonCity.settings.filter = " id = "+id
  if (group == 'jsonCounty') {
    map.removeLayer(countyGroup);
    map.removeLayer(cityGroup);
    countyGroup = L.featureGroup()
    cityGroup = L.featureGroup()
  }else {
    map.removeLayer(cityGroup);
    cityGroup = L.featureGroup()
  }
  let geojsonFeature = {
    "type": "Feature",
    "properties": {id:id}
  };
  ajaxSettings.url=API+"get.php";
  ajaxSettings.data=jsonCity.settings;
  $.ajax(ajaxSettings)
  .done(function(data){
    geojsonFeature.geometry = JSON.parse(data[0].geometry);
    if (group == 'jsonCounty') {
      countyJson = L.geoJson(geojsonFeature, {style:countyStyle}).addTo(countyGroup);
      if(mapClick === false){
        countyGroup.addTo(map)
        if(!$("[name=city]").val()){
          map.fitBounds(countyJson.getBounds());
        }
      }
    }else {
      cityJson = L.geoJson(geojsonFeature, {style:cityStyle}).addTo(cityGroup);
      if (mapClick === false) {
        cityGroup.addTo(map)
        map.fitBounds(cityJson.getBounds());
      }
    }
    mapClick = false;
  })
}

function showPreview(){
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  let thumb = el("thumb");
  let preview = el("thumbPreview");
  let val = thumb.value
  $("#thumbNotAllowed").text("").removeClass('alert alert-danger')
  if(!allowedExtensions.exec(val)){
    $("#thumbNotAllowed")
      .text("Sorry but you can upload only image files. You are trying to upload a "+val.split('.').pop()+" file type")
      .addClass('alert alert-danger')
    return false;
  }
  if(thumb.files.length > 0){
    let src = URL.createObjectURL(thumb.files[0]);
    preview.style.backgroundImage = "url("+src+")";
  }
}

function toggleFullScreen(id) {
  let element = document.getElementById(id)
  if (!document.fullscreenElement) {
    element.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

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

const groupBy = keys => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map(key => obj[key]).join('-');
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

function copy_to_clipboard(el) {
  const host = window.location.origin+'/'+window.location.pathname.split('/')[1]
  const element = el.split('-')[0]
  const text = document.getElementById(el).innerHTML;
  const link = host+'/'+element+'_view.php?uuid='+text
  navigator.clipboard.writeText(link);
  console.log(link);
}
