<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/3dhop.css">
    <link rel="stylesheet" href="css/model.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <form name="newArtifactForm" enctype="multipart/form-data" method="post">
          <fieldset>
            <legend class="border-bottom">Upload model</legend>
            <div class="row mb-3">
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
                <progress id="progressBar" value="0" max="100" style="width:100%;"></progress>
                <h3 id="status"></h3>
                <p id="loaded_n_total"></p>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <div id="wrap3d">
                  <div id="3dhop" class="tdhop" onmousedown="if (event.preventDefault) event.preventDefault()">
                    <!-- <div id="toolbar" class="btn-group" role="group">
                    <button type="button" id="home" class="btn btn-light" data-toggle="tooltip" title="reset zoom"><i class="fa-sharp fa-solid fa-house"></i></button>
                    <button type="button" id="zoomin" class="btn btn-light" data-toggle="tooltip" title="zoom in"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                    <button type="button" id="zoomout" class="btn btn-light" data-toggle="tooltip" title="zoom out"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
                    <button type="button" id="light_on" class="btn btn-light" data-toggle="tooltip" title="enable light control"><i class="fa-solid fa-lightbulb"></i></button>
                    <button type="button" id="full_on" class="btn btn-light" data-toggle="tooltip" title="full screen"><i class="fa-solid fa-expand"></i></button>
                    </div> -->
                    <canvas id="draw-canvas" />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <button type="submit" name="newArtifact" class="btn btn-warning">save item</button>
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
    <script src="js/model.js" charset="utf-8"></script>
  </body>
</html>
