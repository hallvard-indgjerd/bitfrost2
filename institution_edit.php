<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
    <link rel="stylesheet" href="assets/colorPicker/jquery.minicolors.css">
    <link rel="stylesheet" href="css/institution.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="animated mainSection">
      <div class="container">
        <form name="newInstitutionForm" enctype="multipart/form-data">
          <input type="hidden" name="user" value="<?php echo $_SESSION['id']; ?>">
          <input type="hidden" name="institution" value="<?php echo $_GET['item']; ?>">
          <input type="hidden" name="trigger" value="editInstitution">
          <div class="row mb-3">
            <h3 class="border-bottom txt-adc-dark fw-bold">Edit Institution information</h3>
            <div class="form-text">* mandatory field</div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" value="" id="is_storage_place">
                <label class="form-check-label" for="is_storage_place">Is it an artifact storage place?</label>
              </div>
              <div id="colorPicker">
                <div class="input-group">
                  <input type="text" name="color" id="color" class="form-control w-auto" size='7' value="#000000"/>
                  <button class="btn btn-outline-secondary" type="button" id="randomColor">generate</button>
                </div>
                <small id="helpId" class="text-muted">choose a color or generate it randomly, this will identify the Institution in the charts</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="category">* Category</label>
              <select name="category" id="category" class="form-select" required></select>            
            </div>
            <div class="col-md-6 mb-3">
              <label for="name">* Name</label>
              <input type="text" class="form-control" name="name" id="name" autocomplete="off" required>
            </div>
            <div class="col-md-3 mb-3">
              <label for="abbreviation">* Abbreviation</label>
              <input type="text" class="form-control" name="abbreviation" id="abbreviation" required>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="city">* City</label>
              <input id="city" type="text" name="city" class="form-control" value="" placeholder="digit city name" data-cityid='' required>
              <div class="list-group" id="citySuggested"></div>
            </div>
            <div class="col-md-5 mb-3">
              <label for="address">* Address</label>
              <input type="text" id="address" name="address" class="form-control" placeholder="enter street and number" autocomplete="off" required>
            </div>
            <div class="col-md-2 mb-3">
              <label for="longitude">* Longitude</label>
              <input type="number" id="longitude" step="0.000001" class="form-control" value="" min="-180.000000" max="180.000000" required>
            </div>
            <div class="col-md-2 mb-3">
              <label for="latitude">* Latitude</label>
              <input type="number" id="latitude" step="0.000001" class="form-control" value="" min="-90.000000" max="90.000000" required>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <div id="map">
                <div class="alert alert-warning" id="mapAlert">To put a marker on map you have to zoom in</div>
                <div id="resetMapDiv">
                  <button type="button" class="btn btn-sm btn-light" data-bs-toggle="tooltip" title="remove all elements from map, reset field value and restore the initial zoom extent" name="resetMap">reset map value</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-8">
              <label for="url">Institution web site</label>
              <input type="url" name="url" id="url" class="form-control" placeholder="https://">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="logo">upload an image to replace the current logo</label>
              <input type="file" name="logo" id="logo" class="form-control" accept="image/*">
              <div id="imgPlaceholder" class="my-3">
                <img src="" alt="" class="" id="logoPreview">
              </div>
            </div>
          </div>
          <button type="submit" name="newInstitution" class="btn btn-warning">save item</button>
        </form>
      </div>
    </main>
    <?php 
      require("assets/menu.php");
      require("assets/toastDiv.html");
      require("assets/js.html"); 
    ?>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js" charset="utf-8"></script>
    <script src="assets/colorPicker/jquery.minicolors.min.js"></script>
    <script src="js/maps/geo_config.js" charset="utf-8"></script>
    <script src="js/maps/geo_function.js" charset="utf-8"></script>
    <script src="js/institution.js" charset="utf-8"></script>
  </body>
</html>
