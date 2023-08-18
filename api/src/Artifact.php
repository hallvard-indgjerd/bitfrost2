<?php
namespace Adc;
session_start();
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
}
?>
