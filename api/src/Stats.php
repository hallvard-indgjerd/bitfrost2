<?php
namespace Adc;

class Stats extends Conn{

  public function __construct() { }

  public function statIndex(){
    return [
      "artifact" => $this->artifactTot(),
      "model" => $this->modelTot(),
      "institution" => $this->institutionTot(),
      "files" => $this->filesTot(),
      "typeChronologicalDistribution" => $this->typeChronologicalDistribution(),
      "institutionDistribution" => $this->institutionDistribution()
    ];
  }
 
  public function artifactTot(){ return $this->simple("select count(*) tot from artifact;")[0]; }
  public function modelTot(){ return $this->simple("select count(*) tot from model;")[0]; }
  public function institutionTot(){ return $this->simple("select count(*) tot from institution;")[0]; }
  public function filesTot(){ return $this->simple("select count(*) tot from files;")[0]; }

  public function typeChronologicalDistribution(int $type = null){
    $filter = $type !== null ? "artifact.category_class = ".$type." and ": ''; 
    $sql = "select c.definition crono, count(*) tot
    from cultural_generic_period c, artifact 
    where 
      ".$filter."
      artifact.start between c.start and c.end 
      and artifact.end between c.start and c.end 
    group by c.definition
    order by c.id asc;";
    return $this->simple($sql);
  }

  public function institutionDistribution(int $i = null){
    $filter = $i != null ? 'where i.id = '.$i : '';
    $sql = "select i.name, count(*) tot from institution i inner join artifact a on a.storage_place = i.id ".$filter." group by i.id;";
    return $this->simple($sql);
  }

}

?>