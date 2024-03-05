<?php
session_start();
$mainClass = 'large';
if (isset($_SESSION['id']) && isMobileCheck() == 0) {$mainClass = 'small';}

function isMobileCheck(){
  $ua = strtolower($_SERVER["HTTP_USER_AGENT"]);
  $isMob = is_numeric(strpos($ua, "mobile"));
  $isTab = is_numeric(strpos($ua, "tablet"));
  $isAndroid = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "android"));
  $isIPad = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "ipad"));
  $isDesk = !$isMob && !$isTab && !$isAndroid && !$isIPad;
  return $isDesk ? 0 : 1;
}
?>
