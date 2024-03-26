<?php 
  require 'init.php'; 
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>

  </head>
  <body>
    <?php
      $media = isMobileCheck();
      print_r($media); 
    ?>
  </body>
</html>
