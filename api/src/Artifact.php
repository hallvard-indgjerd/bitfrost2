<?php
namespace Adc;
session_start();

use \Adc\Model;
class Artifact extends Conn{
  public $model;
  function __construct(){
    $this->model = new Model();
  }
  public function addArtifact(array $dati){
    try {
      $this->pdo()->beginTransaction();
      $sql = $this->buildInsert("artifact", $dati['artifact']);
      $this->prepared($sql, $dati['artifact']);
      $lastId = $this->pdo()->lastInsertId();

      foreach ($dati['artifact_material_technique'] as $key => $value) {
        $data = array("artifact"=>$lastId, "material"=>$value['m'], "technique" =>$value['t']);
        $sql = $this->buildInsert("artifact_material_technique", $data);
        $this->prepared($sql, $data);
      }

      $dati['artifact_findplace']['artifact'] = $lastId;
      $sql = $this->buildInsert("artifact_findplace", $dati['artifact_findplace']);
      $this->prepared($sql, $dati['artifact_findplace']);

      $this->pdo()->commit();
      return ["res"=> 1, "id"=>$lastId];
    } catch (\Exception $e) {
      $this->pdo()->rollBack();
      return ["res"=>0, "output"=>$e->getMessage()];
    }

  }

  public function checkName(string $name){
    $sql = "select id from artifact where name = '".$name."';";
    return $this->simple($sql);
  }

  public function getArtifacts(array $search){
    $filter = [];
    if($search['status'] > 0){
      array_push($filter, "status_id = ".$search['status']);
    }else {
      array_push($filter, "status_id > ".$search['status']);
    }

    if(isset($search['description'])){
      $string = trim($search['description']);
      $arrString = explode(" ",$string);
      $searchArray = [];
      foreach ($arrString as $value) {
        if(strlen($value)>3){
          array_push($searchArray, " description like '%".$value."%' ");
        }
      }
      $searchString = "(".join(" and ", $searchArray).")";
      array_push($filter,$searchString);
    }

    if($_SESSION['role'] > 4){array_push($filter, "author = ".$_SESSION['id']);}
    if(count($filter) > 0 ){ $filter = "where ".join(" and ", $filter);}
    $sql = "select id, name, description, cast(last_update as date) as last_update from artifact_view ".$filter. " order by last_update desc";
    return $this->simple($sql);
   }

  public function getArtifact(int $id){
    $artifact = "select * from artifact_view where id = ".$id.";";
    $out['artifact'] = $this->simple($artifact)[0];
    $out['artifact_material_technique'] = $this->getArtifactMaterial($id);
    if (!empty($out['artifact']['start'])) { $out['artifact']['from'] = $this->getChronology($out['artifact']['start'])[0]; }
    if (!empty($out['artifact']['end'])) { $out['artifact']['to'] = $this->getChronology($out['artifact']['end'])[0]; }
    $out['storage_place'] = $this->getInstitution($out['artifact']['storage_place'])[0];
    if(count($this->getArtifactMeasure($id))>0){$out['artifact_measure'] = $this->getArtifactMeasure($id);}
    $out['artifact_metadata'] = $this->getArtifactMetadata($id);
    $out['artifact_findplace'] = $this->getArtifactFindplace($id);
    $modelId = $this->getModelId($id);
    if(count($modelId) > 0){
      $out['model'] = $this->model->getModel($modelId[0]['model']);
    }
    return $out;
  }

  private function getModelId($artifact){
    $sql = "select model from artifact_model where artifact = ".$artifact;
    return $this->simple($sql);
  }

  private function getArtifactMaterial(int $id){ return $this->simple("select item.material material_id, material.value material, item.technique from artifact_material_technique item inner join list_material_specs material on item.material = material.id where item.artifact = ".$id.";");}

  private function getChronology(int $year){
    $sql = "select * from nordic_generic_period where ".$year." between start and end order by id";
    return $this->simple($sql);
  }


  private function getInstitution(int $id){
    $sql = "select i.name, i.abbreviation, cat.value category, city.name city, i.address, i.lat, i.lon, i.link from artifact a inner join institution i on a.storage_place = i.id inner join list_institution_category cat on i.category = cat.id inner join city on i.city = city.id where a.id = ".$id.";";
    return $this->simple($sql);
  }
  private function getArtifactMeasure(int $id){ return $this->simple("select * from artifact_measure where artifact = ".$id.";"); }

  private function getArtifactMetadata(int $id){
    $out = [];
    $authorSql = "select p.id, p.first_name, p.last_name from person p inner join user_person up on up.person = p.id inner join user u on up.user = u.id inner join artifact a on a.author = u.id where a.id = ".$id.";";
    $ownerSql = "select i.id, i.name from institution i inner join artifact a on a.owner = i.id where a.id = ".$id.";";
    $licenseSql = "select l.id, l.license, l.acronym, l.link from license l inner join artifact a on a.license = l.id where a.id = ".$id.";";
    $out['author'] = $this->simple($authorSql)[0];
    $out['owner'] = $this->simple($ownerSql)[0];
    $out['license'] = $this->simple($licenseSql)[0];
    return $out;
  }

  private function getArtifactFindplace(int $id){
    $sql = "select nation.name nation, county.name county, city.name city, f.parish, f.toponym, f.lat, f.lon, f.findplace_notes notes from artifact_findplace f inner join city on f.city = city.id inner join county on f.county = county.id inner join nation on county.nation = nation.id where f.artifact = ".$id.";";
    return $this->simple($sql)[0];}

}
?>
