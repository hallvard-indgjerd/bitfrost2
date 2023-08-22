const addUser = $("[name=user]").val()
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
  // el.preventDefault();
}
