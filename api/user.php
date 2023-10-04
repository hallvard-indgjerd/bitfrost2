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
function changePassword($obj){return json_encode($obj->changePassword($_POST));}
function checkAdmin($obj){return json_encode($obj->checkAdmin());}
function checkToken($obj){return json_encode($obj->checkToken($_POST['token']));}
function genPwd($obj){ return json_encode($obj->genPwd()); }
function getUsers($obj){return json_encode($obj->getUsers());}
function login($obj){ return json_encode($obj->login($_POST)); }
function rescuePwd($obj){ return json_encode($obj->rescuePwd($_POST['email'])); }
function resetPassword($obj){ return json_encode($obj->resetPassword($_POST)); }




// function getUsr($obj){
//   $usr = isset($_POST['usr']) ? $_POST['usr'] : null;
//   return json_encode($obj->getUsr($usr));
// }
// function updateUsr($obj){ return json_encode($obj->updateUsr($_POST)); }
// function updatePrivacy($obj){ return json_encode($obj->updatePrivacy($_POST)); }
?>
