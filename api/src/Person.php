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

  public function getPerson(int $id){
    $sql = "select p.id, p.first_name, p.last_name, p.email, p.city, p.address, p.phone, p.institution institution_id, i.name institution, p.position position_id, l.value position from person p left join institution i on p.institution = i.id left join list_person_position l on p.position = l.id where p.id = ".$id.";";
    $out = $this->simple($sql)[0];
    return $out;
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

  public function updatePerson(array $data){
    try {
      $filter = array("id"=>$data['id']);
      unset($data['id']);
      $sql = $this->buildUpdate("person",$filter, $data);
      $this->prepared($sql, $data);
      return ["res"=> 1, "output"=>'your data has been correctly updated'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function getUsrFromPerson(int $person){
    $sql = "select u.id, u.created, u.is_active, l.value role from user u inner join list_user_role l on u.role = l.id where u.person = ".$person.";";
    return $this->simple($sql);
  }

  public function getUsrObjects(int $usr){
    $out=[];
    $artifactStatSql = "select count(*) tot from artifact inner join user on artifact.author = user.id where artifact.author = ".$usr.";";
    $modelStatSql = "select count(*) tot from model_object inner join user on model_object.author = user.id where model_object.author = ".$usr.";";
    $out['artifacts'] = $this->simple($artifactStatSql)[0];
    $out['models'] = $this->simple($modelStatSql)[0];
    return $out;
  }
}
?>
