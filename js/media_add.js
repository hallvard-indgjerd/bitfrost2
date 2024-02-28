const form = $("[name=newMediaForm]")[0]
const artifact = $("[name=artifact]").val();
const type = $("[name=type]").val();

if(type !== 'video'){
  const path = document.getElementById('path');
  const previewImage = document.getElementById('imgPreview');
  
  path.addEventListener('change', event => {
    const fileReader = new FileReader();
    if (path.files.length > 0) {
      fileReader.onload = function handleLoad() {
        previewImage.src = fileReader.result;
        previewImage.style.display = 'block';
      };
      fileReader.readAsDataURL(path.files[0]);
    }
  });
}


$("[type=submit]").on('click', saveMedia)

function saveMedia(e){
  if (form.checkValidity()) {
    e.preventDefault();
    if(type !== 'image'){ const url = document.getElementById('url') }
    if(type == 'document'){
      if(!path.value && !url.value){
        alert('Please, to add a document you have to upload a file or enter a valid url to an external resource')
        return false;
      }
    }
    let dati = new FormData();
    dati.append('trigger','addMedia');
    dati.append('artifact',artifact);
    dati.append('type',type);
    if(type !== 'video'){
      if (path.files.length > 0) {
        dati.append("file", path.files[0], path.files[0].name);
      }
    }
    if(type !== 'image'){
      if(url.value){
        dati.append('url', url.value);
      }
    }
    dati.append('text', $("#text").val());

    ajaxSettings.url=API+'file.php';
    ajaxSettings.data = dati;
    ajaxSettings.enctype = 'multipart/form-data';
    ajaxSettings.processData= false;
    ajaxSettings.contentType= false;
    ajaxSettings.cache= false;
    ajaxSettings.timeout = 800000;

    $.ajax(ajaxSettings)
    .done(function(data) {
      console.log(data);
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        $("#toastDivSuccess").removeClass("d-none")
        setTimeout(function(){ window.location.href="artifact_view.php?item="+artifact; }, 3000);
      }
      $("#toastDivContent").removeClass('d-none')
    }).fail((jqXHR, errorMsg) => {console.log(jqXHR.responseText, errorMsg)});
  }
}