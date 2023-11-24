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
        <form name="newModelForm" enctype="multipart/form-data" method="post">
          <input type="hidden" name="usr" value="<?php echo $_SESSION['id']; ?>">
          <div id="tip" class="alert alert-light border">
            <div>
              <h5 class="fw-bold w-50 d-inline-block">Create a new model</h5>
              <button type="button" class="closeTip btn btn-sm btn-light float-end" aria-label="Close" data-bs-toggle="collapse" data-bs-target="#tipBody" aria-expanded="false" aria-controls="tipBody">hide tip</button>
            </div>
            <div id="tipBody" class="collapse show fs-6 mt-3">A model is understood as a container that can collect multiple three-dimensional objects (for example, the various parts of the same object).<br>At this stage you will create the "container" model to which you can associate one or more digital objects from the model page you just created</div>
          </div>
          <fieldset>
            <legend>Model main data</legend>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="name" class="text-danger fw-bold">Name</label>
                <div class="input-group mb-3">
                  <input type="text" class="form-control" placeholder="name" data-table="model" id="name" required>
                  <button class="btn btn-warning" type="button" name="checkNameBtn">check name</button>
                </div>
                <div id="checkNameResult"></div>
              </div>
              <div class="col-md-6">
                Fill in the "name" field with a value that help you to easily identify the artifact. Remember that you cannot use the same value for different artifacts. To verify if the name already exists, you can insert the value and click the button "check name", a messagge will appears. If you don't check the value now, the system will do it for you when you save the record
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-8">
                <label for="description" class="form-label fw-bold text-danger">Description</label>
                <textarea class="form-control" name="description" id="description" data-table="model" rows="6" required></textarea>
                <div class="form-text">Describe the whole model</div>
              </div>
              <div class="col-md-4">
                <label for="note" class="form-label">Note</label>
                <textarea class="form-control" name="note" id="note" data-table="model" rows="6"></textarea>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <div id="tip2" class="alert alert-light border">
              <div>
                <h5 class="fw-bold w-50 d-inline-block">Create a 3d object to associate with model</h5>
                <button type="button" class="closeTip btn btn-sm btn-light float-end" aria-label="Close" data-bs-toggle="collapse" data-bs-target="#tipBody2" aria-expanded="false" aria-controls="tipBody2">hide tip</button>
              </div>
              <div id="tipBody2" class="collapse show fs-6 mt-3">When you create a model you must necessarily add at least 1 3d object, below you will find the form to associate the 3d object with the model. If the model consists of multiple objects, you can add them later</div>
            </div>
            <legend>Object metadata</legend>
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
                <label for="description" class="form-label fw-bold text-danger">Description</label>
                <textarea class="form-control" name="description" id="description" data-table="model_object" rows="6" required></textarea>
                <div class="form-text">Describe the specific object</div>
              </div>
              <div class="col-md-4">
                <label for="note" class="form-label">Note</label>
                <textarea class="form-control" name="note" id="note" data-table="model_object" rows="6"></textarea>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Object paradata</legend>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="acquisition_method" class="text-danger fw-bold">Acquisition method</label>
                <select class="form-select" name="acquisition_method" id="acquisition_method" data-table="object_param" required>
                  <option value="">-- select value --</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="measure_unit" class="text-danger fw-bold">Measure unit</label>
                <select class="form-select" name="measure_unit" id="measure_unit" data-table="object_param" required>
                  <option value="">-- select unit --</option>
                  <option value="mm">millimeters</option>
                  <option value="cm">centimeters</option>
                  <option value="m">meters</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="software">Software</label>
                <input class="form-control" type="text" id="software" name="software" data-table="object_param">
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-3">
                <label for="points">Points</label>
                <input type="number" class="form-control" min="0" step="1" name="points" id="points" value="">
              </div>
              <div class="col-md-3">
                <label for="polygons">Polygons</label>
                <input type="number" class="form-control" min="0" step="1" name="polygons" id="polygons" value="">
              </div>
              <div class="col-md-2">
                <label for="textures">Textures</label>
                <input type="number" class="form-control" min="0" step="1" name="textures" id="textures" value="">
              </div>
              <div class="col-md-2">
                <label for="scans">Scans</label>
                <input type="number" class="form-control" min="0" step="1" name="scans" id="scans" value="">
              </div>
              <div class="col-md-2">
                <label for="pictures">Pictures</label>
                <input type="number" class="form-control" min="0" step="1" name="pictures" id="pictures" value="">
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Upload model</legend>
            <div class="row">
              <div class="col-md-4">
                <label for="nxz" class="form-label">You can upload only nxz file</label>
                <div class="input-group">
                  <input class="form-control" type="file" id="nxz" name="nxz">
                  <button class="btn btn-secondary" type="button" id="preview"><i class="mdi mdi-monitor-eye"></i>  preview</button>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <p class="text-danger d-inline-block w-auto">to prevent the file from overwriting other files with the same name, the system will assign a unique id as the name of the file</p>
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
                      <h6>the model will be displayed after uploading and clicking the "preview" button</h6>
                    </div>
                  </div>
                  <?php require('assets/canvas.html'); ?>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <div class="row">
              <div class="col">
                <button type="submit" name="newArtifact" class="btn btn-warning">save item</button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
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
    <script src="assets/html2canvas.js" charset="utf-8"></script>
    <script src="js/model_add.js" charset="utf-8"></script>
  </body>
</html>
