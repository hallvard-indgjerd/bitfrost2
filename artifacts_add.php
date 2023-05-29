<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
    <link rel="stylesheet" href="css/artifacts.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <form name="newArtifactForm" enctype="multipart/form-data" method="post">
          <div class="row mb-3">
            <div class="col">
              <h4 class="bg-adc-light txt-adc-dark p-2">Museum Object</h4>
              <small class="text-muted">aka METADATA</small>
            </div>
          </div>
          <fieldset>
            <legend class="border-bottom">Internal data</legend>
            <div class="row mb-3">
              <div class="col-md-3">
                <label for="museum" class="form-label">Museum</label>
                <select class="form-select" id="museum" name="museum" required>
                  <option selected disabled>select a value</option>
                  <option value="1" data-abbr="LUHM">Lund</option>
                  <option value="3" data-abbr="BKM">Blekinge</option>
                  <option value="2" data-abbr="SHM">Stockholm</option>
                  <option value="4">...</option>
                </select>
              </div>
              <div class="col-md-3">
                <label for="inventory" class="form-label">Inventory</label>
                <input type="text" class="form-control" name="inventory" id="inventory" value="no_inv" required>
              </div>
              <div class="col-md-3">
                <label for="visible" class="form-label">Visibility</label>
                <select class="form-select" id="visible" name="visible" required>
                  <option selected disabled>select a value</option>
                  <option value="1">visible</option>
                  <option value="0">not visible</option>
                </select>
              </div>
              <div class="col-md-3">
                <label for="name" class="form-label">Object name</label>
                <input type="text" class="form-control" name="name" id="name" value="no_inv" required>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend class="border-bottom">Physical properties</legend>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="material_class" class="form-label">Material Class</label>
                <select class="form-select" id="material_class" name="material_class"></select>
              </div>
              <div class="col-md-4">
                <label for="material_spec" class="form-label">Material Specification</label>
                <select class="form-select" id="material_spec" name="material_spec" disabled>
                </select>
              </div>
              <div class="col-md-3">
                <label for="technique" class="form-label">Technique</label>
                <input type="search" class="form-control" name="technique" id="technique" value="">
              </div>
              <div class="col-md-1">
                <label for="" class="form-label text-white d-block">trick</label>
                <button type="button" class="btn btn-sm btn-secondary" name="addMaterial"><span class="mdi mdi-plus"></span></button>
              </div>
            </div>
            <div id="materialWrap"></div>
          </fieldset>

          <fieldset>
            <legend class="border-bottom">Dating</legend>
            <div class="row mb-3">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="period1" class="form-label">Start Period</label>
                  <select class="form-select" id="chronoPeriodStart" name="chronoPeriodStart"></select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="period1" class="form-label">End Period</label>
                  <select class="form-select" id="chronoPeriodEnd" name="chronoPeriodEnd" disabled></select>
                </div>
              </div>
              <div class="col-md-2">
                <div class="mb-3">
                  <label for="chronoYearStart" class="form-label">Start year</label>
                  <input type="number" class="form-control" name="chronoYearStart" id="chronoYearStart" step="1" value="" required>
                </div>
              </div>
              <div class="col-md-2">
                <div class="mb-3">
                  <label for="chronoYearEnd" class="form-label">End year</label>
                  <input type="number" class="form-control" name="chronoYearEnd" id="chronoYearEnd" step="1" value="" required>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend class="border-bottom">Locating</legend>
            <div class="row mb-3">
              <div class="col-md-3">
                <div class="mb-3">
                  <label for="countries" class="form-label">Countries</label>
                  <select class="form-select" id="countries" name="countries"></select>
                </div>
                <div class="mb-3">
                  <label for="states" class="form-label">County</label>
                  <select class="form-select" id="states" name="states" disabled></select>
                </div>
                <div class="mb-3">
                  <label for="cities" class="form-label">Village / town / city</label>
                  <select class="form-select" id="cities" name="cities" disabled></select>
                </div>
                <div class="mb-3">
                  <label for="lat" class="form-label">Lat</label>
                  <input type="number" class="form-control" name="lat" id="lat" step="0.01" value="">
                </div>
                <div class="mb-3">
                  <label for="lon" class="form-label">Lon</label>
                  <input type="number" class="form-control" name="lon" id="lon" step="0.01" value="">
                </div>
                <div class="mb-3">
                  <button type="button" class="btn btn-primary form-control" name="resetMap" id="resetMap"><i class="mdi mdi-fullscreen"></i> reset map</button>
                </div>
              </div>
              <div class="col-md-9">
                <div id="map"></div>
                <div class="mb-3">
                  <label for="geoNotes" class="form-label">Additional locating info</label>
                  <textarea name="geoNotes" id="geoNotes" rows="6" class="form-control"></textarea>
                  <small class="text-muted">generic, free text, can be anything: an address, a toponym, an historical collection, a name of excavation campaign</small>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend class="border-bottom">Property metadata</legend>
            <div class="row mb-3">
              <div class="col-md-3">
                <label for="author" class="form-label">Author</label>
                <select class="form-select" id="author" name="author" required>
                  <option selected disabled>select a value</option>
                </select>
                <small class="text-muted">Items list from Person resource</small>
              </div>
              <div class="col-md-3">
                <label for="owner" class="form-label">Owner</label>
                <select class="form-select" id="owner" name="owner" required>
                  <option selected disabled>select a value</option>
                </select>
                <small class="text-muted">Items list from Person resource</small>
              </div>
              <div class="col-md-3">
                <label for="license" class="form-label">License</label>
                <select class="form-select" id="license" name="license" required>
                  <option selected disabled>select a value</option>
                  <option value="">PD</option>
                  <option value="">CC0</option>
                  <option value="">CC-BY</option>
                  <option value="">CC-BY-SA</option>
                  <option value="">CC-BY-SA-NC</option>
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend class="border-bottom">Other info</legend>
            <div class="row mb-3">
              <div class="col-md-3">
                <label for="state" class="form-label">State of item</label>
                <select class="form-select" id="state" name="state" required>
                  <option selected disabled>select a value</option>
                  <option value="1">under processing</option>
                  <option value="0">data complete</option>
                </select>
                <small class="text-muted">an object "under processing" will not be visible in the gallery until the status has changed to "data complete"</small>
              </div>
            </div>
          </fieldset>

          <div class="row mb-3">
            <div class="col">
              <h4 class="bg-adc-light txt-adc-dark p-2">3D Object</h4>
              <small class="text-muted">aka PARADATA</small>
            </div>
          </div>

          <fieldset>
            <legend class="border-bottom">Upload model</legend>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="nxz" class="form-label">You can upload only nxz file</label>
                <div class="input-group">
                  <input class="form-control" type="file" id="nxz" name="nxz" accept="application/octet-stream">
                  <button class="btn btn-secondary" type="button" id="preview"><i class="mdi mdi-monitor-eye"></i>  preview</button>
                </div>
                <div class="">
                  <progress id="progressBar" value="0" max="100" style="width:300px;"></progress>
                  <h3 id="status"></h3>
                  <p id="loaded_n_total"></p>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
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
          </fieldset>

          <button type="submit" name="newArtifact" class="btn btn-warning">save item</button>
        </form>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
    <script type="text/javascript" src="assets/3dhop/spidergl.js"></script>
    <script type="text/javascript" src="assets/3dhop/presenter.js"></script>
    <script type="text/javascript" src="assets/3dhop/nexus.js"></script>
    <script type="text/javascript" src="assets/3dhop/ply.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable_pan.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_pantilt.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_sphere.js"></script>
    <script type="text/javascript" src="assets/3dhop/init.js"></script>
    <script src="js/artifacts.js" charset="utf-8"></script>
    <script type="text/javascript">
      mapInit()
    </script>
  </body>
</html>
