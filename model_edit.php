<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/model_add.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <form id="editModelForm">
          <input type="hidden" name="usr" value="<?php echo $_SESSION['id']; ?>">
          <input type="hidden" name="item" value="<?php echo $_GET['item']; ?>">
          <fieldset>
            <legend>Edit model metadata</legend>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="name" class="text-danger fw-bold">Name</label>
                <div class="input-group mb-3">
                  <input type="text" class="form-control" placeholder="name" data-table="model" id="name" required>
                  <button class="btn btn-warning" type="button" name="checkNameBtn">check name</button>
                </div>
                <div id="checkNameResult"></div>
                <div class="mb-3">
                  <label for="description" class="form-label fw-bold text-danger">Description</label>
                  <textarea class="form-control" name="description" id="description" data-table="model" rows="6" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="note" class="form-label">Note</label>
                  <textarea class="form-control" name="note" id="note" data-table="model" rows="6"></textarea>
                </div>
              
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" value="" id="status" data-table="model">
                  <label class="form-check-label" for="status"></label>
                </div>
                <button type="submit" name="editModel" class="btn btn-warning w-auto">save item</button>
                <a href="model_view.php?item=<?php echo $_GET['item']; ?>" class="btn btn-secondary w-auto">back to model</a>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
    
    <?php
      require("assets/toastDiv.html"); 
      require("assets/menu.php");
      require("assets/js.html");
    ?>
    <script src="js/model_edit.js" charset="utf-8"></script>
  </body>
</html>
