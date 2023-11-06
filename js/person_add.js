// $("#goToItemPage").remove();
const addUser = $("[name=user]").val()
const connector = addUser == 'false' ? 'person.php' : 'user.php';
const trigger = addUser == 'false' ? 'addPerson' : 'addUser';
const form = $("[name=newPersonForm]")[0];
const toastToolBar = $('#toastBtn');

let dati={}

getList(listInstitution.settings,listInstitution.htmlEl,listInstitution.label)
getList(listPosition.settings,listPosition.htmlEl,listPosition.label)
if (addUser == 'true') { getList(listRole.settings,listRole.htmlEl,listRole.label) }

$("[name=newPerson]").on('click', (el) => {newPerson(el)})

function newPerson(el){
  if (form.checkValidity()) {
    el.preventDefault();
    dati.trigger = trigger;
    dati.first_name= $("#first_name").val();
    dati.last_name= $("#last_name").val();
    dati.email= $("#email").val();
    if(addUser == 'true'){
      dati.role = $("#role").val();
      dati.is_active = $("#is_active").is(":checked") ? 1 : 2 ;
    }
    dati.institution= $("#institution").val();
    dati.position= $("#position").val();
    if($("#city").val()){dati.address= $("#city").val();}
    if($("#address").val()){dati.address= $("#address").val();}
    if($("#phone").val()){dati.phone= $("#phone").val();}
    ajaxSettings.url=API+connector;
    ajaxSettings.data = dati;
    $.ajax(ajaxSettings)
    .done(function(data) {
      console.log([dati,data]);
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        gotoIndex.appendTo(toastToolBar);
        gotoDashBoard.appendTo(toastToolBar);
        newRecord.appendTo(toastToolBar);
        $("#toastDivSuccess").removeClass("d-none")
      }
      $("#toastDivContent").removeClass('d-none')
    })
    .fail(function(data){
      form.find(".outputMsg").html(data);
    });
  }
}
