localStorage.getItem('addAdmin') ? $("#noAdmin").remove() : $("#admin").remove();
let title = localStorage.getItem('addAdmin') ? 'Create the first user. This user will be system administrator' : 'Create a new user'
$("#title").text(title);
getSelectOptions('list_user_role', 'en', null, 'role');

$("[name=is_active]").on('change', function(){
  $(this).is(':checked') ? $(this).val(1) : $(this).val(0)
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
$("[type=submit]").on('click', (e)=>{
  let form = e.target.dataset.form;
  addUser(e,form)
})
$("#gen-pwd").on('click', function(){
  ajaxSettings.url=API+"user.php";
  ajaxSettings.data = {trigger:'genPwd'}
  $.ajax(ajaxSettings)
  .done(function(data) {
    $("[name=password]").val(data);
  })
})
function addUser(el,f){
  let form = $("form[name="+f+"]");
  form.find(".outputMsg").removeClass(function (index, className) {
    return (className.match (/(^|\s)text-\S+/g) || []).join(' ');
  }).html(spinner);
  isvalidate = form[0].checkValidity()
  if (isvalidate) {
    el.preventDefault()
    let dati={}
    dati.trigger = f;
    dati.name=$("[name=name]").val()
    dati.email=$("[name=email]").val()
    dati.password=$("[name=password]").val()
    if (localStorage.getItem('addAdmin')) {
      dati.role = 1;
      dati.is_active = 1;
    }else {
      dati.role = $("[name=role]").val()
      dati.is_active = $("[name=is_active]").val()
    }
    ajaxSettings.url=API+"user.php";
    ajaxSettings.data = dati
    $.ajax(ajaxSettings)
    .done(function(data) {
      let classe = data[1] == 0 ? 'text-success' : 'text-danger';
      form.find(".outputMsg").addClass(classe).html(data[0]);
      window.setTimeout(function(){location.href = "index.php";}, 5000);
    }).fail(function(data){form.find(".outputMsg").html(data);});
  }
}
