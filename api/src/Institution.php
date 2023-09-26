<?php
namespace Adc;
session_start();
class Institution extends Conn{
  function __construct(){}

  public function getInstitutions(){
    $sql = "select i.id, i.name, i.abbreviation, cat.value category, city.name city, i.address, i.lat, i.lon, i.link, count(*) artifact
    from institution i
    inner join list_institution_category cat on i.category = cat.id
    inner join city on i.city = city.id
    inner join artifact a on a.owner = i.id
    group by i.id, i.name, i.abbreviation, cat.value , city.name , i.address, i.lat, i.lon, i.link
    order by i.name asc;";
    return $this->simple($sql);
  }

}
?>
