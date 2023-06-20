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

function getPersons($obj){return json_encode($obj->getPersons());}
?>
