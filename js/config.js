const API = 'api/';
const spinner = "<div><div id='spinnerWrap' class='d-inline-block'><i class='mdi mdi-reload'></i></div> loading...</div>";
const toastEL = document.getElementById('toast')
const toast = new bootstrap.Toast(toastEL)

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) { return new bootstrap.Tooltip(tooltipTriggerEl,{trigger:'hover'})})

let ajaxSettings = {method: "POST", timeout: 0, dataType: 'json',}
$("#backdrop").hide()
