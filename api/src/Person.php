<?php
namespace Adc;
session_start();
class Person extends Conn{
  function __construct(){}

  public function addPerson(array $dati){
    try {
      $sql = $this->buildInsert("person", $dati);
      $this->prepared($sql, $dati);
      return ["res"=> 1, "output"=>'Ok, the item has been successfully created'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function getPerson(int $id = null){
    $filter = $id == null ? '' : ' where id = '.$id;
    $sql = "select p.id, concat(p.last_name,' ',p.first_name) as name, email, user_id from person p ".$filter." order by 2 asc;";
    return $this->simple($sql);
  }

  public function getPersons(array $search=NULL){
    if(isset($search['filter'])){
      $string = trim($search['filter']);
      $arrString = explode(" ",$string);
      $searchArray = [];
      foreach ($arrString as $value) {
        if(strlen($value)>3){ 
          array_push($searchArray, " first_name like '%".$value."%' "); 
          array_push($searchArray, " last_name like '%".$value."%' "); 
          array_push($searchArray, " i.name like '%".$value."%' "); 
          array_push($searchArray, " list.value like '%".$value."%' "); 
        }
      }
      $searchString = join(" or ", $searchArray);
    }
    $where = isset($search['filter']) ? "where ".$searchString : '';
    $sql = "select p.id, concat(p.first_name,' ',p.last_name) name, p.email, i.name institution, list.value position from person p left join institution i on p.institution = i.id left join list_person_position list on p.position = list.id ".$where." order by 2 asc;";
    return $this->simple($sql);
  }
}
?>
