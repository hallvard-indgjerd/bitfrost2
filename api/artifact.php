<?php
require 'vendor/autoload.php';
use \Adc\Artifact;
$obj = new Artifact();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function addArtifact($obj){ return json_encode($obj->addArtifact($_POST)); }
function editArtifact($obj){ return json_encode($obj->editArtifact($_POST)); }
function getArtifact($obj){return json_encode($obj->getArtifact($_POST['id']));}
function getArtifacts($obj){return json_encode($obj->getArtifacts($_POST['search']));}
function getArtifactName($obj){return json_encode($obj->getArtifactName($_POST['item']));}
function artifactIssues($obj){return json_encode($obj->artifactIssues());}
?>
