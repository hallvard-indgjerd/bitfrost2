<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/model.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <nav class="itemTool">
        <div class="container-fluid">
          <a href="model_add.php" class="btn btn-dark">add item</a>
          <div class="dropdown d-inline-block">
            <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">sort by</button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">name</a></li>
              <li><a class="dropdown-item" href="#">material</a></li>
              <li><a class="dropdown-item" href="#">category</a></li>
              <li><a class="dropdown-item" href="#">chronology</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container-fluid mt-5">
        <div class="card-wrap"></div>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/model.js" charset="utf-8"></script>
  </body>
</html>
