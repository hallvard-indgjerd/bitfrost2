const sessionActive = $("[name=sessionActive").val();
const role = sessionActive == 1 ? $("[name=role").val() : 0;
const usrDiv = $("#usrDiv");
const person = $("[name=person").val();

if(sessionActive == 0){
  $("#itemTool").addClass('large');
}else{
  $("#itemTool").addClass(checkDevice()=='pc' ? 'small' :'large');
}


getPerson()

function getPerson() {
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'getPerson', id:person}
  $.ajax(ajaxSettings)  
  .done(function(data) {
    console.log(data);
    
    const person = data.person;
    $(".titleSection").text(person.first_name+" "+person.last_name)
    $("#email").text(person.email)
    $("#institution").text(person.institution)
    $("#position").text(person.position)
    $("#city").text(person.city)
    $("#address").text(person.address)
    $("#phone").text(person.phone)

    if(data.user){
      $("#userInfoList").removeClass('d-none')
      $("#noUsrDiv").remove()
      $("#is_active").text(data.user.is_active == 1 ? 'true':'false')
      $("#role").text(data.user.role)
      $("#created_at").text(data.user.created)

      getUsrObjects(data.user.id)
    }else{
      $("#noUsrDiv").removeClass('d-none')
      $("#userInfoList").remove()
      $("#profileName").text(person.first_name+" "+person.last_name)
    }
  });
}

function getUsrObjects(author){
  ajaxSettings.url=API+"person.php";
  ajaxSettings.data={trigger:'getUsrObjects', author:author}
  $.ajax(ajaxSettings)  
  .done(function(data) {
    console.log(data);
    $("#artNum").text(data.artifacts.length)
    $("#modNum").text(data.models.length)

    if(data.artifacts.length == 0){
      $("#noArtifacts").removeClass('d-none')
      $("#artifactsWrap").remove()
    }else{
      $("#artifactsWrap").removeClass('d-none')
      $("#noArtifacts").remove()
      data.artifacts.forEach(rows => {
        let row = $("<tr/>").appendTo('#artifactRows');
        $("<td/>").text(rows.id).appendTo(row)
        $("<td/>").text(rows.name).appendTo(row)
        $("<td/>").text(rows.status == 1 ? 'In process' : 'data complete').appendTo(row)
        $("<td/>").text(rows.description).appendTo(row)
        $("<td/>").html("<a href='artifact_view.php?item="+rows.id+"'>view</a>").appendTo(row)
      });
    }
    if(data.models.length == 0){
      $("#noModels").removeClass('d-none')
      $("#modelsWrap").remove()
    }else{
      $("#modelsWrap").removeClass('d-none').html('')
      $("#noModels").remove()
      data.models.forEach(cards => {
        let card = $("<div/>",{class:'card modelCardSmall'}).appendTo("#modelsWrap");
        $("<div/>", {class:'thumbDiv card-header'}).css("background-image", "url(archive/thumb/"+cards.thumbnail+")").appendTo(card)
        let cardBody = $("<ul/>",{class:'list-group list-group-flush'}).appendTo(card)
        $("<li/>",{class:'list-group-item'}).text(cards.name).appendTo(cardBody)
        $("<li/>",{class:'list-group-item'}).text(cards.description).appendTo(cardBody)
        $("<li/>",{class:'list-group-item'}).text(cards.status == 1 ? 'In process' : 'data complete').appendTo(cardBody)
        $("<li/>",{class:'list-group-item'}).text(cards.create_at.split(" ")[0]).appendTo(cardBody)
        let cardFooter = $("<div/>",{class:'card-footer'}).appendTo(card)
        $("<a/>",{class:'text-dark', title:'open artifact page'}).text('view model').attr({"href":"model_view.php?item="+cards.id}).appendTo(cardFooter);
      })
    }
  })
}