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
        <div class="row">
          <div class="col-4 ms-1 mb-3">
            <input type="text" readonly class="form-control-plaintext d-inline w-auto" id="collectedItems" value="">
            <button type="button" class="btn btn-warning" name="saveColl">save collection</button>
          </div>
        </div>
        <div class="card-wrap"></div>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/artifacts.js" charset="utf-8"></script>
    <script type="text/javascript">
      buildGallery()
    </script>
  </body>
</html>
