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
              <div class="col-md-8">
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
              <div class="col-md-4">
                <div id="initParamObjectForm">
                  <h3>Model init parameters</h3>
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" value="1" id="ortho">
                    <label class="form-check-label" for="ortho">Ortho</label>
                  </div>
                  <div class="mb-3">
                    <label for="view">Select view</label>
                    <select class="form-select" name="view" id="view">
                      <option value="" selected>--select view--</option>
                      <option value="top">top</option>
                      <option value="bottom">bottom</option>
                      <option value="front">front</option>
                      <option value="left">left</option>
                      <option value="right">right</option>
                      <option value="back">back</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="d-block">Set the light</label>
                    <input type="number" name="lightx" value="" class="form-control d-inline" style="width:30%;" placeholder="x value">
                    <input type="number" name="lighty" value="" class="form-control d-inline" style="width:30%;" placeholder="y value">
                    <input type="number" name="lightz" value="" class="form-control d-inline" style="width:30%;" placeholder="z value">
                  </div>
                  <div class="mb-3">
                    <label>Texture type</label>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="texture" id="texture" checked>
                      <label class="form-check-label" for="texture">Texture</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="texture" id="plainColor">
                      <label class="form-check-label" for="plainColor">Plain color</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Solid / transparent</label>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="solid" id="solid" checked>
                      <label class="form-check-label" for="solid">Solid</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="solid" id="plainColor">
                      <label class="form-check-label" for="transparent">Transparent</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Lighting / unshaded</label>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="lighting" id="lighting" checked>
                      <label class="form-check-label" for="lighting">Lighting</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="lighting" id="unshaded">
                      <label class="form-check-label" for="unshaded">Unshaded</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Specular / diffuse</label>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="specular" id="specular" checked>
                      <label class="form-check-label" for="specular">Specular</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="specular" id="diffuse">
                      <label class="form-check-label" for="diffuse">Diffuse</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="grid">Grid type</label>
                    <select class="form-select" name="grid" id="grid">
                      <option value="" selected>--select grid--</option>
                      <option value="off">off</option>
                      <option value="base">base</option>
                      <option value="box">box</option>
                      <option value="fixed">fixed</option>
                    </select>
                  </div>
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" value="1" id="xyz_axes">
                    <label class="form-check-label" for="xyz_axes">XYZ axes</label>
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
