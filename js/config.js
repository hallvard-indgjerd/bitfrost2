const API = 'api/';
const spinner = "<div><div id='spinnerWrap' class='d-inline-block'><i class='mdi mdi-reload'></i></div> loading...</div>";

const toastEL = document.getElementById('toast')
const toast = new bootstrap.Toast(toastEL)

const gotoIndex = $("<a/>",{href:'index.php', class:'btn btn-secondary btn-sm mx-1'}).text('Go to index page')
const gotoDashBoard = $("<a/>",{href:'dashboard.php', class:'btn btn-secondary btn-sm mx-1'}).text('Go to dashboard')
const newRecord = $("<button/>",{type:'button', name:'newRecordBtn', class:'btn btn-secondary btn-sm mx-1'}).text('new record').on('click', function(){location.reload();});
const gotoNewItem = $("<a/>",{href:'', class:'btn btn-secondary btn-sm mx-1'}).text('Go to new item')
const backToItem = $("<a/>",{href:'', class:'btn btn-secondary btn-sm mx-1'}).text('Back to item')
const closeToast = $("<button/>",{type:'button', name:'closeToastBtn', class:'btn btn-secondary btn-sm mx-1'}).text('close');


var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) { return new bootstrap.Tooltip(tooltipTriggerEl,{trigger:'hover', html: true })})

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {return new bootstrap.Popover(popoverTriggerEl, {trigger:'focus', html: true })});

let ajaxSettings = {method: "POST", timeout: 0, dataType: 'json',}
$("#backdrop").hide()


// list
const listInstitution = {
  settings:{trigger:'getSelectOptions',list:'institution'},
  htmlEl: 'institution',
  label: 'value'
}
const listPosition = {
  settings:{trigger:'getSelectOptions',list:'list_person_position'},
  htmlEl: 'position',
  label: 'value'
}
const listRole = {
  settings:{trigger:'getSelectOptions',list:'list_user_role'},
  htmlEl: 'role',
  label: 'value'
}