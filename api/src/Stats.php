<?php
namespace Adc;
use Adc\Get;

class Stats extends Conn{
  public $get;
  public function __construct() {
    $this->get = new Get();
  }

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

  public function artifactByCounty(int $id = null){
    $filter = $id != null ? 'where id = '.$id : '';
    $sql = "with props AS (select county, count(*) tot from artifact_findplace group by county), geom as (select id, name, st_asgeojson(shape) geometry from county) select geom.id, geom.name, geom.geometry, props.tot from props inner join geom on props.county = geom.id;";
    return $this->simple($sql);
  }

}

?>