<?php
// echo $_POST['trigger'];
require 'vendor/autoload.php';
use \Adc\Model;
$obj = new Model();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function saveModel($obj){return json_encode($obj->saveModel($_POST, $_FILES));}
function buildGallery($obj){return json_encode($obj->buildGallery($_POST['sort'], $_POST['filter']));}
function getModel($obj){return json_encode($obj->getModel($_POST['id']));}
function getModels($obj){return json_encode($obj->getModels($_POST['search']));}
function saveModelParam($obj){return json_encode($obj->saveModelParam($_POST));}
function updateModelParam($obj){return json_encode($obj->updateModelParam($_POST));}
function connectModel($obj){return json_encode($obj->connectModel($_POST['data']));}

function test($obj){return json_encode($obj->test($_POST, $_FILES));}


?>
