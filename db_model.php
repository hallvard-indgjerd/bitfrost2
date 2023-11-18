<?php 
  require 'init.php'; 
  // if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <style>
      iframe{
        position:absolute;
        top:80px;
        left: 0;
        right:0;
        bottom:0;
        width: 100%;
        height:calc(100vh - 80px);
      }
    </style>
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <iframe src='https://dbdiagram.io/e/655387dc7d8bbd64652b1423/6556044f3be14957871f8c72'> </iframe>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
  </body>
</html>
