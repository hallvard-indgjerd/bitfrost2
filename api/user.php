<?php
require 'vendor/autoload.php';
use \Adc\User;
$obj = new User();
$funzione = $_POST['trigger'];
unset($_POST['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function addUser($obj){ return json_encode($obj->addUser($_POST)); }
function checkAdmin($obj){return json_encode($obj->checkAdmin());}
function login($obj){ return json_encode($obj->login($_POST)); }
function genPwd($obj){ return json_encode($obj->genPwd()); }
function getUsers($obj){return json_encode($obj->getUsers());}




// function getUsr($obj){
//   $usr = isset($_POST['usr']) ? $_POST['usr'] : null;
//   return json_encode($obj->getUsr($usr));
// }
// function updateUsr($obj){ return json_encode($obj->updateUsr($_POST)); }
// function updatePrivacy($obj){ return json_encode($obj->updatePrivacy($_POST)); }
// function rescuePwd($obj){ return json_encode($obj->rescuePwd($_POST)); }
?>
