<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/models.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <input type="hidden" name="item" value="<?php echo $_GET['item']; ?>">
    <main class="<?php echo $mainClass; ?>">
      <nav class="itemTool">
        <!-- <div class="container-fluid">
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
        </div> -->
      </nav>
      <div class="container-fluid mt-5">
        <?php if(!isset($_GET['item'])){?>
          <div class="noItem pt-5 d-flex flex-column justify-content-center align-items-center ">
            <h2>No artifact selected</h2>
            <p>please come back to dashboard and select an artifact</p>
          </div>
        <?php }else{?> 
          <div id="title" class="text-center border-bottom p-3 mb-4">
            <h3>choose a model from those available to link to the artifact "<span class="fw-bold"></span>"</h3>
          </div>
          <div id="noModelAvailable"></div>
          <div class="card-wrap"></div>
        <?php } ?>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/models.js" charset="utf-8"></script>
  </body>
</html>
