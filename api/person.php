<?php
require 'vendor/autoload.php';
use \Adc\Person;
$obj = new Person();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function getPerson($obj){return json_encode($obj->getPerson($_POST['id']));}
function addPerson($obj){ return json_encode($obj->addPerson($_POST)); }
function updatePerson($obj){ return json_encode($obj->updatePerson($_POST)); }
function delPerson($obj){return json_encode($obj->delPerson($_POST['id']));}
function getPersons($obj){return json_encode($obj->getPersons($_POST['search']));}
function getUsrFromPerson($obj){return json_encode($obj->getUsrFromPerson($_POST['id']));}
function getUsrObjects($obj){return json_encode($obj->getUsrObjects($_POST['author']));}

?>
