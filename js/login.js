checkAdmin()
currentPageActiveLink('login.php');
$("form").css({"width":"350px"})
$("[name=rescuePwd]").hide();
$("[name=toggleRescue]").on('click', () => {
  $("[name=rescuePwd]").fadeToggle('fast');
})
$("#toggle-pwd").click(function() {
  $(this).find('i').toggleClass("mdi-eye mdi-eye-off");
  var input = $("[name=password]");
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});
$("[name=toggleRescue]").on('click', ()=>{ $("[name=email4Rescue]").val('') })

$("[type=submit]").on('click', (e)=>{
  let form = e.target.dataset.form;
  login(e,form)
})

function login(el,f){
  let form = $("form[name="+f+"]");
  form.find(".outputMsg").removeClass(function (index, className) {
    return (className.match (/(^|\s)text-\S+/g) || []).join(' ');
  }).html(spinner);
  isvalidate = form[0].checkValidity()
  if (isvalidate) {
    el.preventDefault()
    let dati={}
    dati.trigger = f;
    if (f == 'login') {
      dati.email=$("[name=email]").val()
      dati.password=$("[name=password]").val()
    }else {
      dati.email=$("[name=email4Rescue]").val()
    }
    ajaxSettings.url=API+"user.php";
    ajaxSettings.data = dati
    $.ajax(ajaxSettings)
    .done(function(data) {
      console.log(data);
      form.find(".outputMsg").removeClass('text-success text-danger');
      let classe = data[1] == 0 ? 'text-success' : 'text-danger';
      form.find(".outputMsg").addClass(classe).html(data[0]);
      if(data[1] == 0){window.setTimeout(function(){location.href = "index.php";}, 3000);}
    }).fail(function(data){form.find(".outputMsg").html(data);});
  }
}
function checkAdmin(){
  ajaxSettings.url=API+"user.php";
  ajaxSettings.data = {trigger:'checkAdmin'}
  $.ajax(ajaxSettings)
  .done(function(data) {
    if(data==0){
      localStorage.setItem("addAdmin", 'true');
      window.location.href="addUser.php"
    }else {
      if (localStorage.getItem("addAdmin")) {
        localStorage.removeItem('addAdmin');
      }
    }
  });
}
