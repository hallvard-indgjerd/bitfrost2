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
    $sql = "select i.name, count(*) tot, i.color from institution i inner join artifact a on a.storage_place = i.id ".$filter." group by i.id;";
    return $this->simple($sql);
  }

  public function artifactByCounty(array $filter){
    $where = '';
    if(count($filter)>0){ $where = "where ". join(" and ",$filter); }
    $sql = "SELECT  county.id, county.name, st_asgeojson(county.shape) AS 'geometry', artifact.tot FROM (SELECT af.county, COUNT(*) AS tot FROM artifact_findplace af inner join artifact on af.artifact = artifact.id ".$where." GROUP BY af.county ) AS artifact JOIN county ON artifact.county = county.id;";
    return $this->simple($sql);
  }


  public function typeInstitutionDistribution(array $filter){
    $where = '';
    if(count($filter)>0){ $where = "where ". join(" and ",$filter); }
    $sql = "select i.name, i.color,count(*) tot from institution i inner join artifact a on a.storage_place = i.id ".$where." group by i.name, i.color;";
    return $this->simple($sql);
  }
}

?>