const API = 'api/';
const spinner = "<div><div id='spinnerWrap' class='d-inline-block'><i class='mdi mdi-reload'></i></div> loading...</div>";

const toastEL = document.getElementById('toast')
const toast = new bootstrap.Toast(toastEL)

const toastToolBar = $('#toastBtn > div');
const gotoDashBoard = $("<a/>",{href:'dashboard.php', class:'btn btn-secondary btn-sm'}).text('Go to dashboard').appendTo(toastToolBar);

const toastMsgInsert = 'OK, the record has been successfully created';
const toastMsgUpdate = 'OK, the record has been successfully updated';
const toastMsgDelete = 'OK, the record has been successfully deleted';


var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) { return new bootstrap.Tooltip(tooltipTriggerEl,{trigger:'hover', html: true })})

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {return new bootstrap.Popover(popoverTriggerEl, {trigger:'focus', html: true })});

let ajaxSettings = {method: "POST", timeout: 0, dataType: 'json',}
$("#backdrop").hide()
