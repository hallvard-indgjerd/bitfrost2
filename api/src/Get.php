<?php
namespace Adc;

class Get extends Conn{
  function __construct(){}

  public function getSelectOptions(string $list, string $column, $filter = null){
    $where = '';
    $field = '';
    switch ($list) {
      case 'person': $field = "id, concat(last_name, ' ',first_name) as name";  break;
      default: $field = '*'; break;
    }
    if($filter){$where = "where ".$filter;}
    $out = "select ".$field." from ".$list." ".$where." order by ".$column." asc;";
    return $this->simple($out);
  }

  public function getFilterList(){
    $out['category'] = $this->simple("select distinct l.id, l.value, count(*) tot from list_category_class l inner join artifact a on a.category_class = l.id group by l.id, l.value order by 2 asc;");
    $out['material'] = $this->simple("select distinct l.id, l.value, count(*) tot from list_material_specs l inner join artifact_material_technique a on a.material = l.id group by l.id, l.value order by 2 asc;");
    $out['chronology'] = $this->simple("select c.definition as period, c.start, c.end, count(*) tot from artifact a, nordic_generic_period c where a.start between c.start and c.end and a.start is not null group by c.definition, c.start, c.end order by c.id asc;");
    return $out;
  }
}
?>
