<?php
require 'vendor/autoload.php';
use \Adc\File;
$obj = new File();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function addMedia($obj){
  if(isset($_FILES['file'])){
    $res = json_encode($obj->addMedia($_POST, $_FILES['file']));
  }else{
    $res = json_encode($obj->addMedia($_POST));
  }
  return $res;
}

function editImage($obj){return json_encode($obj->editImage($_POST));}
function deleteImg($obj){return json_encode($obj->deleteImg($_POST));}

?>