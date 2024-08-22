<?php
namespace Adc;
session_start();

use \Adc\Model;
use \Adc\File;
use \Adc\Institution;

class Artifact extends Conn{
  public $model;
  public $files;
  public $institution;
  function __construct(){
    $this->model = new Model();
    $this->files = new File();
    $this->institution = new Institution();
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
      return ["res"=> 1, "output"=>'Ok, the artifact has been successfully created.', "id"=>$lastId];
    } catch (\Exception $e) {
      $this->pdo()->rollBack();
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function editArtifact(array $dati){
    $filter = $dati['artifact']['artifact'];
    unset($dati['artifact']['artifact']);
    try {
      $this->pdo()->beginTransaction();
      $artifactUpdateSql = $this->buildUpdate('artifact',['id'=>$filter],$dati['artifact']);
      $this->prepared($artifactUpdateSql, $dati['artifact']);
      
      $findPlaceUpdateSql = $this->buildUpdate('artifact_findplace',['artifact'=>$filter],$dati['artifact_findplace']);
      $this->prepared($findPlaceUpdateSql, $dati['artifact_findplace']);
      
      $deleteMaterialSql = $this->buildDelete('artifact_material_technique',array("artifact"=>$filter));
      $this->simple($deleteMaterialSql);

      foreach ($dati['artifact_material_technique'] as $value) {
        $data = array("artifact"=>$filter, "material"=>$value['m'], "technique" =>$value['t']);
        $sql = $this->buildInsert("artifact_material_technique", $data);
        $this->prepared($sql, $data);
      }
      $this->pdo()->commit();
      return ["res"=> 1, "output"=>'Ok, the artifact has been successfully updated.'];
    } catch (\Exception $e) {
      $this->pdo()->rollBack();
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function getArtifacts(array $search){
    $filter = [];
    array_push($filter, "status_id = ".$search['status']);
    // if($search['status'] > 0){
    //   array_push($filter, "status_id = ".$search['status']);
    // }else {
    //   array_push($filter, "status_id > ".$search['status']);
    // }

    if(isset($search['description'])){
      $string = trim($search['description']);
      $arrString = explode(" ",$string);
      $searchArray = [];
      foreach ($arrString as $value) {
        if(strlen($value)>3){
          array_push($searchArray, " (description like '%".$value."%' or name like '%".$value."%') ");
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
    $out['storage_place'] = $this->institution->getInstitution($out['artifact']['storage_place']);
    if(count($this->getArtifactMeasure($id))>0){$out['artifact_measure'] = $this->getArtifactMeasure($id);}
    $out['artifact_metadata'] = $this->getArtifactMetadata($id);
    $out['artifact_findplace'] = $this->getArtifactFindplace($id);
    $modelId = $this->getModelId($id);
    if(count($modelId) > 0){$out['model'] = $this->model->getModel($modelId[0]['model']);}
    $media = $this->files->getMedia($id);
    if(count($media)>0){$out['media'] = $media;}

    if($out['artifact']['timeline'] && $out['artifact']['timeline'] !== null){
      $timeline = $this->simple("select definition from time_series where id = ".$out['artifact']['timeline'].";")[0];
      $out['crono']['timeline'] = $timeline['definition'];
      if (!empty($out['artifact']['start'])){
        $out['crono']['start'] = $this->getChrono($out['artifact']['timeline'],$out['artifact']['start']);
      }
      if (!empty($out['artifact']['end'])){
        $out['crono']['end'] = $this->getChrono($out['artifact']['timeline'],$out['artifact']['end']);
      }
    }
    return $out;
  }

  private function getChrono(int $timeline, int $year){
    return $this->simple("select m.definition as macro, g.definition as generic, s.definition as spec from time_series_macro m inner join time_series_generic g on g.macro = m.id inner join time_series_specific s on s.generic = g.id where m.serie = ".$timeline." and (".$year." between s.start and s.end)")[0];
  }

  private function getModelId($artifact){
    $sql = "select model from artifact_model where artifact = ".$artifact;
    return $this->simple($sql);
  }

  private function getArtifactMaterial(int $id){ return $this->simple("select item.material material_id, material.value material, item.technique from artifact_material_technique item inner join list_material_specs material on item.material = material.id where item.artifact = ".$id.";");}

  private function getArtifactMeasure(int $id){ return $this->simple("select * from artifact_measure where artifact = ".$id.";"); }

  private function getArtifactMetadata(int $id){
    $out = [];
    $authorSql = "select u.id, p.first_name, p.last_name from person p inner join user u on u.person = p.id inner join artifact a on a.author = u.id where a.id = ".$id.";";
    $ownerSql = "select i.id, i.name from institution i inner join artifact a on a.owner = i.id where a.id = ".$id.";";
    $licenseSql = "select l.id, l.license, l.acronym, l.link from license l inner join artifact a on a.license = l.id where a.id = ".$id.";";
    $out['author'] = $this->simple($authorSql)[0];
    $out['owner'] = $this->simple($ownerSql)[0];
    $out['license'] = $this->simple($licenseSql)[0];
    return $out;
  }

  private function getArtifactFindplace(int $id){
    $sql = "select nation.name nation, county.id county_id, county.name county,city.id city_id, city.name city, f.parish, f.toponym, f.latitude, f.longitude, f.findplace_notes notes from artifact_findplace f inner join county on f.county = county.id inner join nation on county.nation = nation.id left join city on f.city = city.id where f.artifact = ".$id.";";
    return $this->simple($sql)[0];
  }

  public function getArtifactName(int $id){
    return $this->simple("select name from artifact where id = ".$id.";")[0];
  }

  public function artifactIssues(){
    $chronoNotInRange = "SELECT a.id, a.name, a.start, coalesce(a.end, '-') end FROM artifact a LEFT JOIN time_series_specific time ON a.start BETWEEN time.start AND time.end OR a.end BETWEEN time.start AND time.end OR (a.start <= time.start AND a.end >= time.end) WHERE time.start IS NULL and a.start is not null order by a.id asc;";
    $chronoNullValue = "SELECT a.id, a.name, coalesce(a.start, '-') start, coalesce(a.end, '-') end FROM artifact a where a.start is null and a.end is null order by a.id asc";
    $sqlNoDescription = "SELECT a.id, a.name FROM artifact a where a.description is null order by a.id asc";
    $out['chronoNotInRange'] = $this->simple($chronoNotInRange);
    $out['chronoNullValue'] = $this->simple($chronoNullValue);
    $out['noDescription'] = $this->simple($sqlNoDescription);

    $db_files = [];
    $files = $this->simple("select object from model_object;");
    foreach ($files as $file) {$db_files[]=$file['object'];}
    if (strpos(__DIR__, 'prototype_dev') !== false) {
      $rootFolder = $_SERVER['DOCUMENT_ROOT'].'/prototype_dev/archive/models/';
    } else {
      $rootFolder = $_SERVER['DOCUMENT_ROOT'].'/plus/archive/models/';
    }
    $folder_files = array_diff(scandir($rootFolder), array('..', '.'));
    $missingModel = array_diff($db_files,$folder_files);
    $missingModelList = implode("','", array_map('addslashes', $missingModel));
    $missingModelList = "'".$missingModelList."'";
    $sqlMissingModel = "select a.id artifact, m.model, a.name, m.object from artifact a inner join artifact_model am on am.artifact = a.id inner join model_object m on am.model = m.model where m.object in (".$missingModelList.") order by a.id asc;";
    $out['missingModel'] = $this->simple($sqlMissingModel);

    return $out;
  }
}
?>
