<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
  if($_GET['t']=='image'){$fileType ='image/png, image/jpeg';}
  if($_GET['t']=='document'){$fileType ='application/pdf, application/msword, application/vnd.oasis.opendocument.text, application/vnd.oasis.opendocument.spreadsheet';}
  
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <style>
      #imgPreview{display: none;}
    </style>
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
          <?php if ($_GET['t'] !== 'video') {?>
            <div class="row mb-3">
              <div class="col">
                <label for="path" class="form-label">upload a file</label>
                <input type="file" name="path" id="path" class="form-control w-auto" accept="<?php echo $fileType; ?>">
                <img src="" id="imgPreview" class="img-fluid w-50" alt="">
              </div>
            </div>
          <?php } ?>
          <?php if ($_GET['t'] !== 'image') {?>
          <div class="row mb-3">
            <div class="col">
              <label for="url" class="form-label">insert a valid url</label>
              <input type="url" name="url" id="url" class="form-control w-75">
            </div>
          </div>
          <?php } ?>
          <div class="row mb-3">
            <div class="col">
              <label for="text" class="form-label">insert a brief descritpion</label>
              <textarea name="text" id="text" rows="10" class="form-control w-75" required></textarea>
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
