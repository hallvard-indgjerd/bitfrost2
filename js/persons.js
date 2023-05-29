initPersons();
$("[name=newPerson]").on('click', (el) => {newPerson(el)})

function initPersons(){
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'getPersons'}
  $.ajax(ajaxSettings)
  .done(function(data) {
    data.forEach((item, i) => {
      let tab = $("#personsList");
      let row = $("<tr/>").appendTo(tab);
      $("<td/>").text(item.id).appendTo(row);
      $("<td/>").text(item.name).appendTo(row);
      $("<td/>").text(item.email).appendTo(row);
      $("<td/>").text(item.user_id == 1 ? 'true' : 'false').appendTo(row);
      let act = $("<td/>").appendTo(row);
      let modBtn = $("<button/>",{type:'button', class:'btn btn-sm btn-light', title:'edit'}).html('<span class="mdi mdi-pencil text-primary"></span>').appendTo(act);
      let delBtn = $("<button/>",{type:'button', class:'btn btn-sm btn-light', title:'delete'}).html('<span class="mdi mdi-trash-can-outline text-danger"></span>').appendTo(act);
    });

  });
}

function newPerson(el){
  el.preventDefault();
}
