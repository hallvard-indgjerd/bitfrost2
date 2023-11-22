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

function getCityFromLonLat($obj){return json_encode($obj->getCityFromLonLat($_POST['point']));}
function getSelectOptions($obj){return json_encode($obj->getSelectOptions($_POST['list'], $_POST['filter'], $_POST['orderBy']));}
function getFilterList($obj){return json_encode($obj->getFilterList());}
function checkName($obj){return json_encode($obj->checkName($_POST));}

?>
