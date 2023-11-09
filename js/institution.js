const form = $("[name=newInstitutionForm]")[0];
const fd = new FormData();
const listTrigger='getSelectOptions';
const citySuggested = $("#citySuggested");
const endpoint = API+'institution.php'

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

$("[name=city]").on({
  keyup: function(){
    let v = $(this).val()
    if(v.length >= 2){
      getCity(v)
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
        logoPreview.classList.remove("invisible");
      };

    }
    fileReader.readAsDataURL(logoInput.files[0]);
  }
})

$("[type=submit]").on('click', (el) => {addInstitution(el)})

function addInstitution(el){
  if(form.checkValidity()){
    el.preventDefault();
    fd.append('trigger', 'addInstitution')
    fd.append('category', $("#category").val())
    fd.append('name', $("#name").val())
    fd.append('abbreviation', $("#abbreviation").val())
    fd.append('city', $("#city").data('cityid'))
    fd.append('address', $("#address").val())
    fd.append('longitude', $("#longitude").val())
    fd.append('latitude', $("#latitude").val())
    fd.append('url', $("#url").val())
    fd.append('folder', 'img/logo/')
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
        console.log(data);
      },
      error: function (e) {
        console.log(e);
      }
    });
  }
}