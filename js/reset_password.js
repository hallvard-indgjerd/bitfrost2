const form = document.getElementById('resetPwd');
const newPwd = document.getElementById("new_pwd");
const confPwd = document.getElementById("confirm_pwd")
const pwdStrength = document.getElementById("password-strength");
const pwdMsg = document.getElementById("pwdMsg");
const token = document.getElementById('token').value;
const toastToolBar = $('#toastBtn');
let email;
checkToken(token)

function checkToken(token){
  ajaxSettings.url=API+'user.php';
  ajaxSettings.data = {trigger:'checkToken', token:token};
  $.ajax(ajaxSettings)
  .done(function(data){
    if (data.res == 0) {
      $("#tokenExpired > h5").text(data.output)
      $("#resetPwd").remove();
      return false;
    }
    $("#tokenExpired").remove();
    $("#resetPwd").removeClass('invisible');
    email=data.output.email;
  });
}

$("#toggle-pwd").on('click', function() {
  $(this).find('i').toggleClass("mdi-eye mdi-eye-off");
  var input = $(".pwd");
  let type = input.attr("type") == "password" ? "text" : "password";
  input.attr("type", type);
});

newPwd.addEventListener("input", getPwdStrength);

$("#genPwd").on('click', generateRandomPassword)

$("[name=resetPwdBtn").on('click', function(e){
  checkPwd()
  if (form.checkValidity()) {
    e.preventDefault()
    let dati={}
    dati.trigger = 'resetPassword';
    dati.token = token;
    dati.email = email;
    dati.password_hash = newPwd.value;
    ajaxSettings.url=API+'user.php';
    ajaxSettings.data = dati;
    $.ajax(ajaxSettings)
    .done(function(data) {
      console.log(data);
      // return false;
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        gotoIndex.appendTo(toastToolBar);
        $("#toastDivSuccess").removeClass("d-none")
      }
      $("#toastDivContent").removeClass('d-none')
    })
    .fail(function(data){
      form.find(".outputMsg").html(data);
    });
  }
})

function checkPwd(){
  //pwd minchar
  if(newPwd.value.length <= 8){
    newPwd.setCustomValidity("Password must have 8 characters at least");
  }else{
    newPwd.setCustomValidity("");
  }
  //pwd matching
  if(newPwd.value !== confPwd.value){
    confPwd.setCustomValidity("Passwords don't match, please check and try again");
  }else{
    confPwd.setCustomValidity("");
  }
}