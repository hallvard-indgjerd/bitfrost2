<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/model_view.css">
    <link rel="stylesheet" href="css/my3dhop.css">
  </head>
  <body>
    <?php 
      require("assets/header.php"); 
      require("assets/loadingDiv.html"); 
    ?>
    <main class="<?php echo $mainClass; ?>">
      <input type="hidden" name="modelId" value="<?php echo $_GET['item']; ?>">
      <input type="hidden" name="activeUsr" value="<?php echo $_SESSION['id']; ?>">
      <input type="hidden" name="role" value="<?php echo $_SESSION['role']; ?>">

      <div id="mainContent">
      <?php require('assets/canvas.html'); ?>
      </div>

    </main>
    <?php 
      require("assets/menu.php");
      require("assets/toastDiv.html"); 
      require("assets/js.html"); 
    ?>
    <script type="text/javascript" src="assets/3dhop/spidergl.js"></script>
    <script type="text/javascript" src="assets/3dhop/presenter.js"></script>
    <script type="text/javascript" src="assets/3dhop/nexus.js"></script>
    <script type="text/javascript" src="assets/3dhop/ply.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable_pan.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_pantilt.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_sphere.js"></script>
    <script type="text/javascript" src="assets/3dhop/init.js"></script>
    <script src="js/3dhop_function.js"></script>
    <script src="js/model_view.js" charset="utf-8"></script>
  </body>
</html>
