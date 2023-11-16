<?php
require 'vendor/autoload.php';
use \Adc\Institution;
$obj = new Institution();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function getInstitutions($obj){return json_encode($obj->getInstitutions());}
function getInstitution($obj){return json_encode($obj->getInstitution($_POST['id']));}
function addInstitution($obj){return json_encode($obj->addInstitution($_POST, $_FILES));}
function editInstitution($obj){return json_encode($obj->editInstitution($_POST, $_FILES));}
function deleteInstitution($obj){return json_encode($obj->deleteInstitution($_POST['id']));}
?>
