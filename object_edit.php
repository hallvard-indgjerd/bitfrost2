<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/model_add.css">
    <link rel="stylesheet" href="css/my3dhop.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <form name="editObjForm" enctype="multipart/form-data" method="post">
          <input type="hidden" name="session" value="<?php echo $_SESSION['id']; ?>">
          <input type="hidden" name="item" value="<?php echo $_GET['item']; ?>">
          <input type="hidden" name="model" value="<?php echo $_GET['model']; ?>">

          <fieldset>
            <legend>Edit Object metadata</legend>
            <div class="row">
              <div class="col-md-4">
                <label for="author" class="fw-bold text-danger">Author</label>
                <select class="form-select" data-table="model_object" id="author" required></select>
              </div>
              <div class="col-md-4">
                <label for="owner" class="fw-bold text-danger">Owner</label>
                <select class="form-select" data-table="model_object" id="owner" required>
                  <option value="" selected disabled>-- select value --</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="license" class="fw-bold text-danger">License</label>
                <select class="form-select" data-table="model_object" id="license" required>
                  <option value="" selected disabled>-- select license --</option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <div class="form-text text-center">each object that makes up the model may be made by different people and belong to different institutions, and the rights holders may decide to use different licenses</div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-8">
                <label for="object_description" class="form-label fw-bold text-danger">Description</label>
                <textarea class="form-control" name="object_description" id="object_description" data-table="model_object" rows="6" required></textarea>
                <div class="form-text">Describe the specific object</div>
              </div>
              <div class="col-md-4">
                <label for="object_note" class="form-label">Note</label>
                <textarea class="form-control" name="object_note" id="object_note" data-table="model_object" rows="6"></textarea>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Object paradata</legend>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="acquisition_method" class="text-danger fw-bold">Acquisition method</label>
                <select class="form-select" name="acquisition_method" id="acquisition_method" data-table="model_param" required>
                  <option value="" selected disabled>-- select value --</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="measure_unit" class="text-danger fw-bold">Measure unit</label>
                <select class="form-select" name="measure_unit" id="measure_unit" data-table="model_param" required>
                  <option value="" selected disabled>-- select unit --</option>
                  <option value="mm">millimeters</option>
                  <option value="cm">centimeters</option>
                  <option value="m">meters</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="software">Software</label>
                <input class="form-control" type="text" id="software" name="software" data-table="model_param">
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-2">
                <label for="points">Points</label>
                <input type="number" class="form-control" min="0" step="1" name="points" id="points" value="" data-table="model_param">
              </div>
              <div class="col-md-2">
                <label for="polygons">Polygons</label>
                <input type="number" class="form-control" min="0" step="1" name="polygons" id="polygons" value="" data-table="model_param">
              </div>
              <div class="col-md-2">
                <label for="textures">Textures</label>
                <input type="number" class="form-control" min="0" step="1" name="textures" id="textures" value="" data-table="model_param">
              </div>
              <div class="col-md-2">
                <label for="scans">Scans</label>
                <input type="number" class="form-control" min="0" step="1" name="scans" id="scans" value="" data-table="model_param">
              </div>
              <div class="col-md-2">
                <label for="pictures">Pictures</label>
                <input type="number" class="form-control" min="0" step="1" name="pictures" id="pictures" value="" data-table="model_param">
              </div>
              <div class="col-md-2">
                <label for="encumbrance" data-bs-toggle="tooltip" title="you can enter a value or let the system calculate it"><span class="mdi mdi-information-outline"></span> Encumbrance</label>
                <input type="text" class="form-control" name="encumbrance" id="encumbrance" value="" data-table="model_param">
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" value="" id="status" data-table="model_object">
                  <label class="form-check-label" for="status"></label>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Upload model</legend>
            <div class="row">
              <div class="col" id="nxzWrap">
                <label for="nxz" class="form-label inputLabel">select .nxz file</label>
                <input class="form-control" type="file" id="nxz" name="nxz" accept=".nxz,.nxs">
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <div class="alert alert-danger" role="alert" id="uploadTip">
                Before uploading you have to select the "measure unit" from the specifica field in the "Object paradata" section of the form
                </div>
                <progress id="progressBar" value="0" max="100" style="width:100%;"></progress>
                <h3 id="status"></h3>
                <p id="loaded_n_total"></p>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <div id="wrap3d">
                  <div id="alertBg">
                    <div class="alert alert-danger text-center">
                      <h3>Waiting for the model...</h3>
                      <h6>the model will be displayed after uploading an allowed file</h6>
                    </div>
                  </div>
                  <?php require('assets/canvas.html'); ?>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div id="thumbWrap" class="col">
                <label for="thumb" class="form-label inputLabel">Upload a thumbnail</label>
                <input class="form-control" type="file" id="thumb" name="thumb" accept="image/jpeg, image/png, image/jpg" >
                <div class="col-md-4 my-3 border rounded" id="thumbPreview"></div>
                <div id="thumbNotAllowed"></div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <div class="row">
              <div class="col">
                <button type="submit" name="saveObj" class="btn btn-warning">save item</button>
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
    <!-- <script type="text/javascript" src="assets/3dhop/spidergl.js"></script>
    <script type="text/javascript" src="assets/3dhop/presenter.js"></script>
    <script type="text/javascript" src="assets/3dhop/nexus.js"></script>
    <script type="text/javascript" src="assets/3dhop/ply.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable_pan.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_pantilt.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_sphere.js"></script>
    <script type="text/javascript" src="assets/3dhop/init.js"></script>
    <script src="js/3dhop_function.js"></script> -->
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
    <script src="js/object_edit.js" charset="utf-8"></script>
  </body>
</html>
