<?php
namespace Adc;

class Get extends Conn{
  function __construct(){}

  public function getSelectOptions(string $list, $filter = null, $orderBy=null){
    $where = '';
    $field = '';
    switch ($list) {
      case 'institution':
        $field = "id, concat(abbreviation, ' - ',name) as value";
      break;
      case 'person':
        $field = "id, concat(last_name, ' ',first_name) as name";
      break;
      case 'license':
        $field = "id, concat(acronym, ' - ',license) as name";
      break;
      case 'city':
        $field = "id, iso country_code, name";
      break;
      // case 'cities':
      //   $field = "id, latitude, longitude, name, country_code";
      // break;
      case 'json':
        $field = "st_asgeojson(shape) geometry";
        $list = 'city';
      break;
      default: $field = '*'; break;
    }
    if($filter){$where = "where ".$filter;}
    $sort = $orderBy ? $orderBy : 2;
    $out = "select ".$field." from ".$list." ".$where." order by ".$sort." asc;";
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
