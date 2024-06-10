const artifact = $("[name=artifact]").val()
const activeUser = $("[name=usr]").val()
getArtifact()

$("[name=editArtifact]").on('click', function(el){updateMeta(el)})

function getArtifact(){
  ajaxSettings.url=API+"artifact.php";
  ajaxSettings.data={trigger:'getArtifact', id:artifact};
  $.ajax(ajaxSettings)
  .done(function(data) {
    console.log(data);
    $("#pageTitle").text(data.artifact.name)
    $("#name").val(data.artifact.name)
    $("#status").val(data.artifact.status_id)
    $("#description").val(data.artifact.description)
    $("#notes").val(data.artifact.notes)
    $.when($("#category_class").val(data.artifact.category_class_id)).then(function(){
      handleCategoryChange()
      if(data.artifact.category_specs_id){$("#category_specs").val(data.artifact.category_specs_id)}
    })
    $("#type").val(data.artifact.type)

    data.artifact_material_technique.forEach(function(v){
      let t = v.technique ? v.technique : null;
      let m = v.material_id;
      materialTechniqueArray.push({m, t});
      let row = $("<div/>", {class:'row wrapfield mb-3'}).appendTo("#matTechArray");
      let matDiv = $("<div/>", {class:'material'}).appendTo(row);
      let techDiv = $("<div/>", {class:'technique'}).appendTo(row);
      $("<input/>", {class:'form-control', type:'text'}).prop('readonly', true).val(v.material).appendTo(matDiv);
      let iptGrp = $("<div/>", {class:'input-group'}).appendTo(techDiv)
      $("<input/>", {class:'form-control', type:'text'}).prop('readonly', true).val(v.technique).appendTo(iptGrp);
      $("<button/>",{class:'btn btn-danger', type:'button', name:'delRow', title:'delete row'})
        .attr({"data-bs-toggle":'tooltip'})
        .html('<span class="mdi mdi-trash-can"></span>')
        .appendTo(iptGrp)
        .on('click', function(){
          let idx = $("#matTechArray .row").index(row);
          materialTechniqueArray.splice(idx,1)
          row.remove();
          $(this).tooltip('hide')
        })
        .tooltip()
    })

    $("#start").val(data.artifact.start)
    $("#end").val(data.artifact.end)
    $("#storage_place").val(data.artifact.storage_place)
    if(data.artifact.inventory){$("#inventory").val(data.artifact.inventory)}
    $("#conservation_state").val(data.artifact.conservation_state_id)
    if(data.artifact.object_condition_id){$("#object_condition").val(data.artifact.object_condition_id)}
    $("#is_museum_copy").prop('checked',data.artifact.is_museum_copy).on('click',function(){
      let label = $(this).is(':checked') ? 'yes' : 'no';
      $("label[for='is_museum_copy").text(label)
    });
    $("label[for='is_museum_copy").text(data.artifact.is_museum_copy==1?'yes':'no')

    if(data.artifact_findplace !== null){
      let fp = data.artifact_findplace
      $("#county").val(fp.county_id)
      $("#city").val(fp.city).attr("data-cityid",fp.city_id)
      if (fp.parish) {$("#parish").val(fp.parish)}
      if (fp.toponym) {$("#toponym").val(fp.toponym)}
      if (fp.notes) {$("#findplace_notes").val(fp.notes)}
      if (fp.latitude) {
        $("#latitude").val(fp.latitude)
        $("#longitude").val(fp.longitude)
        let findplace = [parseFloat(fp.latitude), parseFloat(fp.longitude)]
        marker = L.marker(findplace).addTo(map);
        map.setView(findplace,15)
      }
      let meta = data.artifact_metadata
      $("#author").val(meta.author.id)
      $("#owner").val(meta.owner.id)
      $("#license").val(meta.license.id)
    }
  })
}

function updateMeta(btn){
  checkMaterialArray()
  // materialTechniqueArray.forEach(function(v,i){ materialTechniqueArray[i]['artifact']=artifact })
  if (form[0].checkValidity()) {
    btn.preventDefault()
    dati.trigger = 'editArtifact';
    dati.artifact={}
    $("[data-table=artifact]").each(function(){
      let field = $(this).attr('id')
      let val = $(this).val()
      if(val){dati.artifact[field]=val}
    })
    dati.artifact.is_museum_copy = $("#is_museum_copy").is(":checked") ? 1 : 0;
    dati.artifact_material_technique = materialTechniqueArray;
    dati.artifact_findplace ={}
    $("[data-table=artifact_findplace]").each(function(){
      let field = $(this).attr('id')
      let val = $(this).val()
      if(val){dati.artifact_findplace[field]=val}
    })
    if ($("#city").val()) { dati.artifact_findplace.city = $("#city").data('cityid') }
    ajaxSettings.url=API+"artifact.php";
    ajaxSettings.data = dati
    $.ajax(ajaxSettings)
    .done(function(data) {
      // console.log(data);
      if (data.res==0) {
        $("#toastDivError .errorOutput").text(data.output);
        $("#toastDivError").removeClass("d-none");
      }else {
        $(".toastTitle").text(data.output)
        gotoIndex.appendTo(toastToolBar);
        gotoDashBoard.appendTo(toastToolBar);
        backToItem.attr("href","artifact_view.php?item="+artifact).appendTo(toastToolBar);
        $("#toastDivSuccess").removeClass("d-none")
      }
      $("#toastDivContent").removeClass('d-none')
    });
  }

}