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

  public function getPersons(array $search){
    $filters = [];
    $search['cat'] = (int) $search['cat'];
    switch (true) {
      case $search['cat'] == 0:
        array_push($filters,'(u.is_active is null or u.is_active > 0)');
        break;
      case $search['cat'] == 1:
      case $search['cat'] == 2:
        array_push($filters,'u.is_active = '.$search['cat']);
        break;
      case $search['cat'] == 3:
        array_push($filters,'u.is_active is null');
        break;
    }
    if(isset($search['name'])){
      $searchByName = [];
      $string = trim($search['name']);
      $arrString = explode(" ",$string);
      foreach ($arrString as $value) {
        if(strlen($value)>3){ 
          array_push($searchByName, "first_name like '%".$value."%'"); 
          array_push($searchByName, "last_name like '%".$value."%'"); 
          array_push($searchByName, "i.name like '%".$value."%'"); 
          array_push($searchByName, "list.value like '%".$value."%'"); 
          array_push($searchByName, "p.email like '%".$value."%'"); 
          array_push($searchByName, "u.role like '%".$value."%'"); 
        }
      }
      array_push($filters, "(".join(" or ", $searchByName).")");
    }
    $joinFilters = join(" and ", $filters);
    $where = "where ".$joinFilters; 
    $sql = "select p.id, concat(p.first_name,' ',p.last_name) name, p.email, i.id inst_id, i.name institution, list.value position, u.role, u.is_active, u.artifact, u.model from person p left join institution i on p.institution = i.id left join list_person_position list on p.position = list.id left join user_artifact_view u on u.person_id = p.id ".$where." order by 2 asc;";
    return $this->simple($sql);
    // return $sql;
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
    $sql = "select u.id, u.created, u.is_active, l.id role_id, l.value role from user u inner join list_user_role l on u.role = l.id where u.person = ".$person.";";
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
