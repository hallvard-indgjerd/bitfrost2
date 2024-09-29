const form = $("[name=personForm]")[0];
const toastToolBar = $('#toastBtn');
const connector = 'person.php';
// let trigger;
getList(listInstitution.settings,listInstitution.htmlEl,listInstitution.label)
getList(listPosition.settings,listPosition.htmlEl,listPosition.label)
getList(listRole.settings, listRole.htmlEl, listRole.label)

let item = 0;
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
if(params.size == 1){item = parseInt(params.get("item"));}

if(item == 0){ 
  // trigger = 'addPerson';
  $("#title").text('Add new person profile');
}else{
  trigger = 'updatePerson';
  setTimeout(function(){getPerson(item);},500)  
}


function getPerson(item){
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'getPerson', id:item}
  $.ajax(ajaxSettings).done(function(data) {
    const person = data.person;
    $("<input/>", {type:'hidden', id:'personId', value:person.id}).prependTo(form)
    $("#title").text("Edit "+person.first_name+" "+person.last_name+" profile");
    $("#first_name").val(person.first_name)
    $("#last_name").val(person.last_name)
    $("#email").val(person.email)
    $("#institution").val(person.institution_id)
    $("#position").val(person.position_id)
    $("#city").val(person.city)
    $("#address").val(person.address)
    $("#phone").val(person.phone)
    
    if(data.user){
      trigger = 'updatePerson';
      $(".userInput").prop("disabled", false)
      const user = data.user;
      $("#usrFieldAlert").addClass('d-none');
      $("#role").val(user.role_id);
      $("#is_active").prop('checked', user.is_active == 1);
      $("<input/>", {type:'hidden', id:'userId', value:user.id}).appendTo("#userField")
    }else{
      $("[name=delPerson]").removeClass('d-none').on('click', delPerson);
    }
  });
}

function delPerson(){
  if(confirm('are you sure?')){
    ajaxSettings.url=API+"person.php";
    ajaxSettings.data={trigger:'delPerson', id:item}
    $.ajax(ajaxSettings).done(function(data) {
      console.log(data);
      if (data.res==1) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        gotoIndex.appendTo(toastToolBar);
        gotoDashBoard.appendTo(toastToolBar);
        $("#toastDivSuccess").removeClass("d-none")
      }
      $("#toastDivContent").removeClass('d-none')
    })
  }
}


$("#createAccount").on('change', function(){
  let check = $(this).is(":checked")
  $("#role").prop("required", check)
  $("#is_active").prop("checked", check)
  $(".userInput").prop("disabled", !check)
})

$("[name=person]").on('click', (el) => {person(el)})
function person(el){
  if (form.checkValidity()) {
    el.preventDefault();
    let trigger;
    let dati={
      person:{
        id: $("#personId").val(),
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
        email: $("#email").val(),
        institution: $("#institution").val(),
        position: $("#position").val()
      }
    }
    if($("#city").val()){dati.person.city= $("#city").val();}
    if($("#address").val()){dati.person.address= $("#address").val();}
    if($("#phone").val()){dati.person.phone= $("#phone").val();}

    trigger = item == 0 ? 'addPerson' : 'updatePerson';

    if($("#createAccount").is(":checked") || $("#userId").val() > 0){
      dati.user = {
        role: $("#role").val(),
        is_active: $("#is_active").is(":checked") ? 1 : 2
      }
      if($("#userId").val() > 0){
        dati.user.id = $("#userId").val()
      }
    }
    dati.trigger = trigger;
    ajaxSettings.url=API+connector;
    ajaxSettings.data = dati;
    console.log(ajaxSettings);
    
    $.ajax(ajaxSettings)
    .done(function(data) {
      if (data.res==1) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        gotoIndex.appendTo(toastToolBar);
        gotoDashBoard.appendTo(toastToolBar);
        // newRecord.appendTo(toastToolBar);
        $("#toastDivSuccess").removeClass("d-none")
      }
      $("#toastDivContent").removeClass('d-none')
    })
    .fail(function(data){
      $("#outputMsg").html(data);
    });
  }
}
