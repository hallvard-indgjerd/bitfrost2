<?php
namespace Adc;

class Stats extends Conn{

  public function __construct() { }

  public function typeChronologicalDistribution(int $type){
    $sql = "select c.definition crono, count(*) tot
    from cultural_generic_period c, artifact 
    where 
      artifact.category_class = ".$type." 
      and artifact.start between c.start and c.end 
      and artifact.end between c.start and c.end 
    group by c.definition, artifact.category_class
    order by c.id asc;";
    return $this->simple($sql);
  }

}

?>