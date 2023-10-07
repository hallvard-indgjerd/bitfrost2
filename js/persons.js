const apiPerson = API+"person.php";
const trigger = 'updatePerson'
const personMainFieldForm = document.getElementById('usrMainFieldForm')
const personAffiliationForm = document.getElementById('usrAffiliationForm') 
const personalInformationForm = document.getElementById('personalInformationForm') 
const toastToolBar = $('#toastBtn');
// initPersons();

$("#changeUsrMainFieldBtn").on('click', function(el){ changePersonMainField(el); })
$("#changeUsrAffiliationBtn").on('click', function(el){ changePersonAffiliation(el); })
$("#changePersonalInformationBtn").on('click', function(el){ changePersonInformation(el); })

// function initPersons(){
//   ajaxSettings.url=apiPerson;
//   ajaxSettings.data={trigger:'getPersons'}
//   $.ajax(ajaxSettings)
//   .done(function(data) {
//     data.forEach((item, i) => {
//       let tab = $("#personsList");
//       let row = $("<tr/>").appendTo(tab);
//       $("<td/>").text(item.id).appendTo(row);
//       $("<td/>").text(item.name).appendTo(row);
//       $("<td/>").text(item.email).appendTo(row);
//       $("<td/>").text(item.user_id == 1 ? 'true' : 'false').appendTo(row);
//       let act = $("<td/>").appendTo(row);
//       let modBtn = $("<button/>",{type:'button', class:'btn btn-sm btn-light', title:'edit'}).html('<span class="mdi mdi-pencil text-primary"></span>').appendTo(act);
//       let delBtn = $("<button/>",{type:'button', class:'btn btn-sm btn-light', title:'delete'}).html('<span class="mdi mdi-trash-can-outline text-danger"></span>').appendTo(act);
//     });

//   });
// }

function getPerson(person) {
  ajaxSettings.url=apiPerson;
  ajaxSettings.data={trigger:'getPerson', id:person}
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(data);
    $("#first_name").val(data.first_name)
    $("#last_name").val(data.last_name)
    $("#email").val(data.email)
    if(data.institution_id){
      $("#institution option[value="+data.institution_id+"]").prop('selected',true)
    }
    if(data.position_id){
      $("#position option[value="+data.position_id+"]").prop('selected',true)
    }
    $("#city").val(data.city)
    $("#address").val(data.address)
    $("#phone").val(data.phone)
  });
}

function changePersonMainField(btn) {
  if(personMainFieldForm.checkValidity()){
    btn.preventDefault();
    ajaxSettings.url=apiPerson;
    ajaxSettings.data={
      trigger : trigger,
      id : person,
      first_name : $("#first_name").val(),
      last_name : $("#last_name").val(),
      email : $("#email").val()
    }
    $.ajax(ajaxSettings)
    .done(function(data){
      console.log(data);
    });
  }
}

function changePersonAffiliation(btn) {
  if(personAffiliationForm.checkValidity()){
    btn.preventDefault();
    ajaxSettings.url=apiPerson;
    ajaxSettings.data={
      trigger: trigger,
      id:person,
      institution : $("#institution").val(),
      position : $("#position").val()
    }
    $.ajax(ajaxSettings)
    .done(function(data){
      console.log(data);
    });
  }
}

function changePersonInformation(btn) {
  btn.preventDefault();
  ajaxSettings.url=apiPerson;
  ajaxSettings.data={
    trigger:trigger, 
    id:person, 
    city:$("#city").val(), 
    address:$("#address").val(), 
    phone:$("#phone").val()
  }
  $.ajax(ajaxSettings)
  .done(function(data){
    console.log(data);
  }).fail(function(data){
    console.log(data);
  });
}
