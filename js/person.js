const sessionActive = $("[name=sessionActive").val();
const role = sessionActive == 1 ? $("[name=role").val() : 0;
const usrDiv = $("#usrDiv");
const person = $("[name=person").val();
$(".invisible").hide()
getPerson()
getUsrFromPerson()
getList(listRole.settings,listRole.htmlEl,listRole.label)

$("#usrFromPersonBtn").on('click', function(el){ createUsrFromPerson(el) })

function createUsrFromPerson(btn){
  btn.preventDefault();
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'createUsrFromPerson'}
  ajaxSettings.data.person = person;
  console.log(ajaxSettings.data);
}

function getPerson() {
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'getPerson', id:person}
  $.ajax(ajaxSettings)  
  .done(function(data) {
    $(".titleSection").text(data.first_name+" "+data.last_name)
    $("#email").text(data.email)
    $("#institution").text(data.institution)
    $("#position").text(data.position)
    $("#city").text(data.city)
    $("#address").text(data.address)
    $("#phone").text(data.phone)
  });
}

function getUsrFromPerson(){
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'getUsrFromPerson', id:person}
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(data);
    if(data.length == 0){
      $(".invisible").remove();
      return false;
    }
    $(".invisible").removeClass('invisible').show()
  });
}

function createUsrDiv(data){
  usrDiv.html('')
  let active = data.is_active == 1 ? 'true' : 'false';
  let class_active = data.is_active == 1 ? 'alert-success' : 'alert-danger';
  let card = $("<div/>", {class:'card'}).appendTo(usrDiv);
  $("<div/>",{class:'card-header'}).html("<h6>User data</h6>").appendTo(card);
  let ul = $("<ul/>", {class:'list-group list-group-flush'}).appendTo(card);
  let footer = $("<div/>",{class:'card-footer'}).appendTo(card);
  $("<li/>",{class:'list-group-item'}).html('<span class="fw-bold">is active: </span><span class="alert '+class_active+' p-2 m-0">'+active+'</span>').appendTo(ul)
  $("<li/>",{class:'list-group-item'}).html('<span class="fw-bold">role: </span><span>'+data.role+'</span>').appendTo(ul)
  $("<li/>",{class:'list-group-item'}).html('<span class="fw-bold">created at: </span><span>'+data.created+'</span>').appendTo(ul)
  $("<a/>", {class:'btn btn-sm btn-adc-dark', href:'user_edit.php?u='+data.id}).text('edit user').appendTo(footer);

  getUsrObjects(data.id)
}

function getUsrObjects(id){
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'getUsrObjects', author:id}
  $.ajax(ajaxSettings)
  .done(function(data) {
    $(".myArtifacts .myCardStat>h2").text(data.artifacts.tot)
    $(".myModels .myCardStat>h2").text(data.models.tot)
  });
}