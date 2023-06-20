<?php
namespace Adc;
session_start();
class Person extends Conn{
  function __construct(){}

  public function getPersons(int $id = null){
    $filter = $id == null ? '' : ' where id = '.$id;
    $sql = "select p.id, concat(p.last_name,' ',p.first_name) as name, email, user_id from person p ".$filter." order by 2 asc;";
    return $this->simple($sql);
  }

}
?>
