$("#goToItemPage").remove();
const addUser = $("[name=user]").val()
const connector = addUser == 'false' ? 'person.php' : 'user.php';
const trigger = addUser == 'false' ? 'addPerson' : 'addUser';
const form = $("[name=newPersonForm]")[0];
let dati={}
let listInstitution = {
  settings:{trigger:'getSelectOptions',list:'institution'},
  htmlEl: 'institution',
  label: 'value'
}
let listPosition = {
  settings:{trigger:'getSelectOptions',list:'list_person_position'},
  htmlEl: 'position',
  label: 'value'
}
let listRole = {
  settings:{trigger:'getSelectOptions',list:'list_user_role'},
  htmlEl: 'role',
  label: 'value'
}
getList(listInstitution.settings,listInstitution.htmlEl,listInstitution.label)
getList(listPosition.settings,listPosition.htmlEl,listPosition.label)
if (addUser == 'true') {
  getList(listRole.settings,listRole.htmlEl,listRole.label)
}

$("[name=newPerson]").on('click', (el) => {newPerson(el)})

function newPerson(el){
  if (form.checkValidity()) {
    el.preventDefault();
    dati.trigger = trigger;
    dati.first_name= $("#first_name").val();
    dati.last_name= $("#last_name").val();
    dati.email= $("#email").val();
    if(addUser == 'true'){
      dati.role_id = $("#role").val();
      dati.role = $("#role option:selected").text();
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
        $("#toastDivSuccess").removeClass("d-none")
        $("#toastDivSuccess #createNewRecord").attr("href","persons_add.php?user="+addUser)
      }
      $("#toastDivContent").removeClass('d-none')
    })
    .fail(function(data){
      form.find(".outputMsg").html(data);
    });
  }
}
