const addUser = $("[name=user]").val()
let trigger = addUser == 'false' ? 'addPerson' : 'addUser';
console.log(trigger);
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
    dati.trigger = 'addPerson';
    ajaxSettings.url=API+"artifact.php";
    ajaxSettings.data = dati
  }
}
