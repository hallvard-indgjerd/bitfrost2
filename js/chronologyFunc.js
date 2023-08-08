$("#start").on('change keyup', handleChronoChange)

$("#startGenericList").on('change', (el) => {
  let v = el.target.value;
  if(!v){
    $("#startSpecificList,#endGenericList, #endSpecificList").prop('disabled',true).html('');
    return false;
  }
  $("#startSpecificList, #endGenericList, #endSpecificList").prop('disabled',false).html('<option value="">-- no filter --</option>');
  chronoGeneric.settings.filter = " id >= " + v;
  chronoSpecific.settings.filter = " generic = " + v;
  getList(chronoGeneric.settings,'endGenericList', 'definition');
  getList(chronoSpecific.settings,'startSpecificList', 'definition');
  getList(chronoSpecific.settings,'endSpecificList', 'definition');
});

$("#startSpecificList").on('change', (el) => {
  let v = el.target.value;
  if (!v) { return false;}
  $("#endGenericList, #endSpecificList").html('<option value="">-- no filter --</option>');
  let generic = $("#startGenericList").val();
  chronoGeneric.settings.filter = " id >= "+generic;
  chronoSpecific.settings.filter = " generic = "+generic+ " and id >= " + v;
  getList(chronoGeneric.settings,'endGenericList', 'definition');
  getList(chronoSpecific.settings,'endSpecificList', 'definition');
});

$("#endGenericList").on('change', (el) => {
  let v = el.target.value;
  if (!v) { return false;}
  let startGen = $("#startGenericList").val();
  let startSpec = $("#startSpecificList").val();
  chronoSpecific.settings.filter = " generic = " + v;
  if(v== startGen && startSpec){
    chronoSpecific.settings.filter += " and id >= "+startSpec;
  }
  $("#endSpecificList").html('<option value="">-- no filter --</option>');
  getList(chronoSpecific.settings,'endSpecificList', 'definition');
});

$("#startGenericList, #startSpecificList").on('change',function(){
  if (!$(this).val()) { return false;}
  let min = $(this).find('option:selected').data('start');
  let max = $(this).find('option:selected').data('end');
  $("#start").attr({"min":min,"max":max}).val(min)
  if (!$("#endGenericList").val() || !$("#endSpecificList").val()) {
    $("#end").attr({"min":min,"max":max}).val(max)
  }
})


$("#endGenericList, #endSpecificList").on('change',function(){
  if (!$(this).val()) { return false;}
  let min = $(this).find('option:selected').data('start');
  let max = $(this).find('option:selected').data('end');
  $("#end").attr({"min":min,"max":max}).val(max)
})
