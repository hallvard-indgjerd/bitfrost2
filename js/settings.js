const usr = document.getElementById('user');
const formPwd = document.getElementById('pwdForm');
const curPwd = document.getElementById("current_pwd");
const newPwd = document.getElementById("new_pwd");
const confPwd = document.getElementById("confirm_pwd")
const pwdStrength = document.getElementById("password-strength");
const pwdMsg = document.getElementById("pwdMsg");


$("#toggle-pwd").click(function() {
  $(this).find('i').toggleClass("mdi-eye mdi-eye-off");
  var input = $(".pwd");
  let type = input.attr("type") == "password" ? "text" : "password";
  input.attr("type", type);
});

newPwd.addEventListener("input", function () {
    const pwdVal = newPwd.value;
    let result = zxcvbn(pwdVal);  
    pwdStrength.className = "strength-" + result.score;
    pwdMsg.innerHTML = getPwdMsg(result.score)
});

$("#pwdChangeBtn").on('click', function (e) {
  checkPwd()
  if (formPwd.checkValidity()) {
    e.preventDefault()
    let dati={}
    dati.trigger = 'changePassword';
    dati.id = usr.value;
    dati.curPwd = curPwd.value;
    dati.password_hash = newPwd.value;
    ajaxSettings.url=API+'user.php';
    ajaxSettings.data = dati;
    $.ajax(ajaxSettings)
    .done(function(data) {
      console.log([dati,data]);
      // return false;
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(toastMsgInsert)
        $("#toastDivSuccess").removeClass("d-none")
      }
      $("#toastDivContent").removeClass('d-none')
    })
    .fail(function(data){
      form.find(".outputMsg").html(data);
    });
  }
});

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

function getPwdMsg(score){
  let msg='';
  switch (score) {
    case 0: msg = 'too weak'; break;
    case 1: msg = 'very weak'; break;
    case 2: msg = 'moderately weak'; break;
    case 3: msg = 'fairly strong'; break;
    case 4: msg = 'very strong'; break;
    default: msg = ''; break;
  }
  return msg;
}