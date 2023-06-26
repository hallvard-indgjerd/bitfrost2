<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
  echo $_SERVER['DOCUMENT_ROOT'];
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
                    <div class="d-flex justify-content-between align-items-start">
                      <div class="w-50">
                        <canvas id="lightcontroller_canvas" width="100" height="100"></canvas>
                      </div>
                      <div class="w-50">
                        <input type="number" name="lightx" value="" step="0.001" class="form-control mb-2" placeholder="x value">
                        <input type="number" name="lighty" value="" step="0.001" class="form-control" placeholder="y value">
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Texture type</label>
                    <div class="toggleSwitch">
                      <input type="checkbox" name="texture" class="toggleSwitch-checkbox" id="texture" checked>
                      <label class="toggleSwitch-label" for="texture">
                        <span class="toggleSwitch-inner" id="textureLabel"></span>
                        <span class="toggleSwitch-switch"></span>
                      </label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Solid type</label>
                    <div class="toggleSwitch">
                      <input type="checkbox" name="solid" class="toggleSwitch-checkbox" id="solid" checked>
                      <label class="toggleSwitch-label" for="solid">
                        <span class="toggleSwitch-inner" id="solidLabel"></span>
                        <span class="toggleSwitch-switch"></span>
                      </label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Light type</label>
                    <div class="toggleSwitch">
                      <input type="checkbox" name="lighting" class="toggleSwitch-checkbox" id="lighting" checked>
                      <label class="toggleSwitch-label" for="lighting">
                        <span class="toggleSwitch-inner" id="lightingLabel"></span>
                        <span class="toggleSwitch-switch"></span>
                      </label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Light direction</label>
                    <div class="toggleSwitch">
                      <input type="checkbox" name="specular" class="toggleSwitch-checkbox" id="specular" checked>
                      <label class="toggleSwitch-label" for="specular">
                        <span class="toggleSwitch-inner" id="specularLabel"></span>
                        <span class="toggleSwitch-switch"></span>
                      </label>
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
