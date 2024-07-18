<?php
session_start();
$logged = isset($_SESSION['id']) ? 1 : 0;
$checkDevice = isMobileCheck();
$mainClass = 'large';
$navClass = 'closed';
if (isset($_SESSION['id']) && $checkDevice['pc'] == 1) {
  $mainClass = 'small';
  $navClass = 'open';
}

function isMobileCheck(){
  $ua = strtolower($_SERVER["HTTP_USER_AGENT"]);
  $isMob = is_numeric(strpos($ua, "mobile")) ? 1 : 0;
  $isTab = is_numeric(strpos($ua, "tablet")) ? 1 : 0;
  $isAndroid = is_numeric(strpos($ua, "android")) ? 1 : 0;
  $isIPad = is_numeric(strpos($ua, "ipad")) ? 1 : 0;
  $isDesk = $isMob==0 && $isTab==0 && $isAndroid==0 && $isIPad==0 ? 1 : 0;
  return ["mobile"=>$isMob, "tablet"=>$isTab, "iPad"=>$isIPad,"android"=>$isAndroid,"pc"=>$isDesk];
}
?>
