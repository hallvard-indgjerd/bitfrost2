<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
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

    <!-- <div class="modal fade" id="mainDataModel" data-bs-backdrop="static" tabindex="-1" aria-labelledby="editMainDataModel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editMainDataModel">Edit model metdata</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="editModelForm">
            <div class="modal-body">
              <div class="mb-3">
                <label for="name" class="text-danger fw-bold">Name</label>
                <div class="input-group mb-3">
                  <input type="text" class="form-control" placeholder="name" data-table="model" id="name" required>
                  <button class="btn btn-warning" type="button" name="checkNameBtn">check name</button>
                </div>
                <div id="checkNameResult"></div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label fw-bold text-danger">Description</label>
                <textarea class="form-control" name="description" id="description" data-table="model" rows="6" required></textarea>
                <div class="form-text">Describe the whole model</div>
              </div>
              <div class="mb-3">
                <label for="note" class="form-label">Note</label>
                <textarea class="form-control" name="note" id="note" data-table="model" rows="6"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="status" data-table="model">
                  <label class="form-check-label" for="status"></label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" id="editModelBtn" class="btn btn-sm btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div> -->

    <!-- <div class="modal fade" id="objectMetadata" data-bs-backdrop="static" tabindex="-1" aria-labelledby="editObjectMetadata" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editObjectModel">Edit object metdata</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="editObjectForm">
            <div class="modal-body">
              <div class="mb-3">
                <label for="author" class="fw-bold text-danger">Author</label>
                <select class="form-select" data-table="model_object" id="author" required></select>
              </div>
              <div class="mb-3">
                <label for="owner" class="fw-bold text-danger">Owner</label>
                <select class="form-select" data-table="model_object" id="owner" required></select>
              </div>
              <div class="mb-3">
                <label for="license" class="fw-bold text-danger">License</label>
                <select class="form-select" data-table="model_object" id="license" required></select>
              </div>
              <div class="mb-3">
                <label for="object_description" class="fw-bold text-danger">Description</label>
                <textarea class="form-control" name="object_description" id="object_description" data-table="model_object" rows="6" required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" id="editModelBtn" class="btn btn-sm btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div> -->
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
