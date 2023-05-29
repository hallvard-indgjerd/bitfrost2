<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/artifacts.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <nav class="itemTool">
        <div class="container-fluid">
          <a href="artifacts_add.php" class="btn btn-dark">add item</a>
          <a href="#" class="btn btn-dark">edit item</a>
          <a href="#" class="btn btn-dark">delete item</a>
        </div>
      </nav>
      <div class="container mt-5">

      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/artifacts.js" charset="utf-8"></script>
  </body>
</html>
