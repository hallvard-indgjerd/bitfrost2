if($("[name=institution]").length > 0){ getInstitution($("[name=institution]").val()) }
const trigger = $("[name=trigger]").val() 
const form = $("[name=newInstitutionForm]")[0];
const fd = new FormData();
const listTrigger='getSelectOptions';
const citySuggested = $("#citySuggested");
const endpoint = API+'institution.php'
const toastToolBar = $('#toastBtn');

let autocompleted = false;
let listArray = [];
citySuggested.hide()
$("#resetMapDiv").hide()
let listCategory = {
  settings: {trigger:listTrigger, list:'list_institution_category', orderBy:'value', filter:''},
  htmlEl: 'category',
  label: 'value'
}
let listCity = {
  settings: {trigger:listTrigger, list:'city', orderBy:'name', filter:''},
  htmlEl: 'city',
  label: 'name'
}
let jsonCity = {
  settings: {trigger:listTrigger, list:'', orderBy:'1', filter:''},
}
listArray.push(listCategory)
listArray.forEach((item, i) => {getList(item.settings,item.htmlEl,item.label)});
mapInit()
getInstitutions()

$("[name=city]").on({
  keyup: function(){
    let city = $(this).val()
    if(city.length >= 2){
      osmSearch(city)
      // getCity(city)
    }else{
      citySuggested.html('').fadeOut('fast')
    }
  }
})

$(document).on('click', (event) => {
  if(!$(event.target).closest('#citySuggested').length &&
  $('#citySuggested').is(":visible")) {
    let city = $("[name=city]").val()
    $('#citySuggested').fadeOut('fast');
    if(city && !autocompleted){
      $("[name=city]").val('').attr({"data-cityid":''})
    }
  }
})


const logoInput = document.getElementById('logo');
const logoPreview = document.getElementById('logoPreview');
$("#imgPlaceholder").hide()
const cropWidth = 200;
const cropHeight = 200;
let cropX, cropY;

logoInput.addEventListener('change', event => {
  if(logoInput.files.length > 0){
    const fileReader = new FileReader();
    fileReader.onload = function handleLoad(){
      let img = new Image()
      img.src = fileReader.result;

      img.onload = function () {
        let origW = img.naturalWidth;
        let origH = img.naturalHeight;
        let newW, newH;
        if(origW > origH){
          newH = 200;
          newW = Math.floor((origW*200)/origH);
        }
        if(origH > origW){
          newW = 200;
          newH = Math.floor((origH*200)/origW)
        }
        if(origW == origH){
          newW = 200;
          newH = 200;
        }      
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = newW;
        croppedCanvas.height = newH;
        // croppedCanvas.width = cropWidth;
        // croppedCanvas.height = cropHeight;

        // crop from the center
        cropX = img.width/2;
        cropY = img.height/2;
        croppedCtx.drawImage(img, 0, 0, newW, newH);
        // crops but not scale
        // croppedCtx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        logoPreview.src = croppedCanvas.toDataURL('image/png');
        $("#imgPlaceholder").show()
      };

    }
    fileReader.readAsDataURL(logoInput.files[0]);
  }
})

$("[type=submit]").on('click', (el) => {addInstitution(el)})

function addInstitution(el){
  if(form.checkValidity()){
    el.preventDefault();
    fd.append('trigger', trigger)
    if($("[name=institution]").length > 0){fd.append('id', $("[name=institution]").val()) }
    let is_storage_place = $("#is_storage_place").is(":checked") ? 1 : 0;
    fd.append('is_storage_place', is_storage_place)
    fd.append('category', $("#category").val())
    fd.append('name', $("#name").val())
    fd.append('abbreviation', $("#abbreviation").val())
    fd.append('city', $("#city").data('cityid'))
    fd.append('address', $("#address").val())
    fd.append('lon', $("#longitude").val())
    fd.append('lat', $("#latitude").val())
    fd.append('url', $("#url").val())
    if(logoInput.files.length > 0){fd.append('logo', logoInput.files[0])}
    $.ajax({
      type: "POST",
      enctype: 'multipart/form-data',
      url: endpoint,
      dataType: 'json',
      data: fd,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 800000,
      success: function (data) {
        if (data.res==0) {
          $("#toastDivError .errorOutput").text(data.output);
          $("#toastDivError").removeClass("d-none");
        }else {
          $(".toastTitle").text(data.output)
          gotoIndex.appendTo(toastToolBar);
          gotoDashBoard.appendTo(toastToolBar);
          $("#toastDivSuccess").removeClass("d-none")
        }
        $("#toastDivContent").removeClass('d-none')
      },
      error: function (e) {
        console.log(e);
      }
    });
  }
}

function getInstitution(id){
  ajaxSettings.url=API+"institution.php";
  ajaxSettings.data = {trigger:'getInstitution', id:id}
  $.ajax(ajaxSettings).done(function(data){
    console.log(data);
    $("#category").find("option[value="+data.catid+"]").attr('selected', true)
    $("#name").val(data.name)
    $("#abbreviation").val(data.abbreviation)
    $("#city").val(data.city).attr("data-cityid",data.cityid)
    $("#address").val(data.address)
    $("#longitude").val(data.lon)
    $("#latitude").val(data.lat)
    $("#url").val(data.url)

    if (marker != undefined) { map.removeLayer(marker)};
    marker = L.marker([data.lat, data.lon]).addTo(map);
    map.flyTo([data.lat, data.lon], 17, {animate: true, duration: 2})

    if (data.logo) {
      $("#logoPreview").attr({"src":'img/logo/'+data.logo, "width":300})
      $("#imgPlaceholder").show()
    }else{

    }
  })
}

function getInstitutions(){
  let institutionGroup = L.markerClusterGroup().addTo(map);
  layerControl.addOverlay(institutionGroup, "Existing Institution");
  let dati={}
  dati.trigger='getInstitutions';
  ajaxSettings.url=API+"institution.php";
  ajaxSettings.data = dati
  $.ajax(ajaxSettings).done(function(data){
    data.forEach((item, i) => {
      L.marker([parseFloat(item.lat), parseFloat(item.lon)],{icon:storagePlaceIco})
      .bindPopup("<div class='text-center'><h6 class='p-0 m-0'>"+item.name+"</h6><p class='p-0 m-0'>Artifacts stored: <strong>"+item.artifact+"</strong></p></div>")
      .addTo(institutionGroup);
    });
    map.fitBounds(institutionGroup.getBounds())
  });
}
