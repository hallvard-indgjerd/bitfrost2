checkAdmin()
currentPageActiveLink('login.php');
$("form").css({"width":"350px"})
$("[name=rescuePwd]").hide();
$("[name=toggleRescue]").on('click', () => { $("[name=rescuePwd]").fadeToggle('fast'); })

$("#toggle-pwd").click(function() {
  $(this).find('i').toggleClass("mdi-eye mdi-eye-off");
  var input = $(".pwd");
  let type = input.attr("type") == "password" ? "text" : "password";
  input.attr("type", type);
});

$("[name=loginBtn]").on('click', (el)=>{ login(el) })
$("[name=toggleRescue]").on('click', ()=>{ $("[name=email4Rescue]").val('') })
$("[name=rescuePwdBtn]").on('click', (el)=>{ rescuePwd(el) })

function login(el){
  const form = $("form[name=login]");
  form.find(".outputMsg").removeClass(function (index, className) {
    return (className.match (/(^|\s)text-\S+/g) || []).join(' ');
  }).html(spinner);
  if (form[0].checkValidity()) {
    el.preventDefault()
    let dati={}
    dati.trigger = 'login';
    dati.email=$("[name=email]").val()
    dati.password=$("[name=password]").val()
    ajaxSettings.url=API+"user.php";
    ajaxSettings.data = dati
    $.ajax(ajaxSettings)
    .done(function(data) {
      form.find(".outputMsg").removeClass('text-success text-danger');
      let classe = data[1] == 0 ? 'text-success' : 'text-danger';
      form.find(".outputMsg").addClass(classe).html(data[0]);
      if(data[1] == 0){window.setTimeout(function(){location.href = "dashboard.php";}, 3000);}
    }).fail(function(data){form.find(".outputMsg").html(data);});
  }
}

function rescuePwd(el){
  const form = $("form[name=rescuePwd]");
  form.find(".outputMsg").removeClass(function (index, className) {
    return (className.match (/(^|\s)text-\S+/g) || []).join(' ');
  }).html(spinner);
  if (form[0].checkValidity()) {
    el.preventDefault()
    let dati={}
    dati.trigger = 'rescuePwd';
    dati.email=$("[name=email4Rescue]").val()
    ajaxSettings.url=API+"user.php";
    ajaxSettings.data = dati
    $.ajax(ajaxSettings)
    .done(function(data) {
      form.find(".outputMsg").removeClass('text-success text-danger');
      let classe = data.res == 1 ? 'text-success' : 'text-danger';
      form.find(".outputMsg").addClass(classe).html(data.output);
      if(data.res == 1){window.setTimeout(function(){location.href = "index.php";}, 5000);}
    }).fail(function(data){
      console.log("error: "+data);
      form.find(".outputMsg").html(data);
    });
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
