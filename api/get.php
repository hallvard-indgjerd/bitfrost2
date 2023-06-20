<?php
require 'vendor/autoload.php';
use \Adc\Get;
$obj = new Get();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function getSelectOptions($obj){return json_encode($obj->getSelectOptions($_POST['list'], $_POST['column'], $_POST['filter']));}

function getFilterList($obj){return json_encode($obj->getFilterList());}

?>
