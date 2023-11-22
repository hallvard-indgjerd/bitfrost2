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
      case 'user':
        $field = "u.id, concat(p.last_name, ' ',p.first_name) as name";
        $list = "user u inner join person p on u.person = p.id ";
      break;
      case 'license':
        $field = "id, concat(acronym, ' - ',license) as name";
      break;
      case 'city':
        $field = "id, concat(name,' (', iso, ')') name, county";
      break;
      case 'county':
        $field = "id, concat(name,' (', iso, ')') name";
      break;
      case 'jsonCity':
        $field = "st_asgeojson(shape) geometry";
        $list = 'city';
      break;
      case 'jsonCounty':
        $field = "st_asgeojson(shape) geometry";
        $list = 'county';
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

  public function getCityFromLonLat(array $point){
    $sql = "select id, name, county from city where st_contains(city.shape, st_srid(st_geomfromtext('POINT(".$point[0]." ".$point[1].")'), 4326));";
    return $this->simple($sql);
  }
  public function getCountyByCity(int $city){
    $sql = "select county.id, county.name from county, city where city.id = ".$city." and city.county = county.id;";
    return $this->simple($sql)[0];
  }
  public function checkName(array $data){
    $sql = "select id from ".$data['element']." where name = '".$data['name']."';";
    return $this->simple($sql);
  }
}
?>
