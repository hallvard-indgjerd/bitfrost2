<?php
namespace Adc;
session_start();
use Model;
class Artifact extends Conn{
  function __construct(){}
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

  public function getArtifact(int $id){
    $artifact = "select * from artifact_view where id = ".$id.";";
    $out['artifact'] = $this->simple($artifact)[0];
    $out['artifact_material_technique'] = $this->getArtifactMaterial($id);

    // if (!empty($out['artifact']['start'])) { $out['start_period'] = $this->getChronology($out['artifact']['start']); }
    // if (!empty($out['artifact']['end'])) { $out['end_period'] = $this->getChronology($out['artifact']['end']); }
    // $out['artifact_metadata'] = $this->getArtifactMetadata($id)[0];
    // $out['artifact_measure'] = $this->getArtifactMeasure($id)[0];
    // $out['artifact_findplace'] = $this->getArtifactFindplace($id)[0];
    // $out['storage_place'] = $this->getInstitution($out['artifact']['storage_place'])[0];
    // $out['paradata'] = $this->getModel($model);
    return $out;
  }

  private function getArtifactMaterial(int $id){ return $this->simple("select material.value material, item.technique from artifact_material_technique item inner join list_material_specs material on item.material = material.id where item.artifact = ".$id.";");}



  private function getInstitution(int $id){
    $sql = "select i.name, i.abbreviation, cat.value category, cities.name city, i.address, i.lat, i.lon, i.link from artifact a inner join institution i on a.storage_place = i.id inner join list_institution_category cat on i.category = cat.id inner join cities on i.city = cities.id where a.id = ".$id.";";
    return $this->simple($sql);
  }
  private function getArtifactMeasure(int $id){ return $this->simple("select * from artifact_measure where artifact = ".$id.";"); }

  private function getArtifactFindplace(int $id){ return $this->simple("select cities.name city, item.* from artifact_findplace item left join cities on item.city = cities.id where item.artifact = ".$id.";");}


  private function getChronology(int $year){
    $sql = "select * from nordic_generic_period where ".$year." between start and end order by id";
    return $this->simple($sql);
  }

  private function getArtifactMetadata(int $id){
    $sql = "select auth.name auth, owner.name owner, license.license, license.acronym, license.link licenseLink, item.create_at, item.updated_at
    from artifact_metadata item
    inner join user auth on item.author = auth.id
    inner join institution owner on item.owner = owner.id
    inner join license on item.license = license.id
    where item.artifact = ".$id.";";
    return $this->simple($sql);
  }
}
?>
