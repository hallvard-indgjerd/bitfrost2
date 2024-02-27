<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <form name="newMediaForm">
          <input type="hidden" name="artifact" value="<?php echo $_GET['item']; ?>">
          <input type="hidden" name="type" value="<?php echo $_GET['t']; ?>">
          <div class="row mb-3">
            <div class="col">
              <h3 class="border-bottom">Add new <?php echo $_GET['t']; ?> to the <span id="artifactName"></span> artifact</h3>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label for="path">upload a file</label>
              
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button type="submit" class="btn btn-adc-dark w-auto d-inline-block me-2">save <?php echo $_GET['t']; ?></button>
              <a href="artifact_view.php?item=<?php echo $_GET['item']; ?>" class="btn btn-secondary w-auto d-inline-block">back to artifact</a>
            </div>
          </div>
        </form>
      </div>
    </main>
    <?php 
      require("assets/menu.php");
      require("assets/toastDiv.html");
      require("assets/js.html"); 
    ?>
    <script src="js/media_add.js" charset="utf-8"></script>
  </body>
</html>
