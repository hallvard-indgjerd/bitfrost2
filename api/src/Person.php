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

  public function getPersonDashboardList(){
    $sql="WITH
      artifact AS (select u.id, u.name, u.role_id, role.value role, u.is_active, count(artifact.id) tot from user u inner join list_user_role role on u.role_id = role.id left join artifact on artifact.author = u.id group by u.id, u.name),
      model AS (select u.id, count(model.id) tot from user u left join model_metadata model on model.author = u.id group by u.id, u.name)
    SELECT artifact.id, artifact.name, artifact.role, artifact.is_active, artifact.tot artifact, model.tot model FROM artifact JOIN model
    WHERE artifact.id = model.id
    ORDER BY artifact.name asc;";
    return $this->simple($sql);
  }
}
?>
