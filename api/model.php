<?php
require 'vendor/autoload.php';
use \Adc\Model;
$obj = new Model();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function buildGallery($obj){return json_encode($obj->buildGallery($_POST['sort'], $_POST['filter']));}
function getArtifact($obj){return json_encode($obj->getArtifact($_POST['id']));}
?>
