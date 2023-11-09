<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
  $title = $_GET['user']=='false' ? 'Person' : 'User';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
    <link rel="stylesheet" href="css/institution.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        
        <form name="newInstitutionForm" enctype="multipart/form-data">
          <input type="hidden" name="user" value="<?php echo $_SESSION['id']; ?>">
          <div class="row mb-3">
            <h3 class="border-bottom txt-adc-dark fw-bold">New Institution</h3>
            <div class="form-text">* mandatory field</div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="category">* Category</label>
              <select name="category" id="category" class="form-select" required>
                <option value="" selected disabled>-- select a value --</option>
              </select>            
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
              <!-- <div id="cityMsg" class="form-text text-danger">No city selected</div> -->
              <div class="list-group" id="citySuggested"></div>
            </div>
            <div class="col-md-5 mb-3">
              <label for="address">* Address</label>
              <input type="text" id="address" name="address" class="form-control" placeholder="enter street and number" autocomplete="off" required>
            </div>
            <div class="col-md-2 mb-3">
              <label for="longitude">* Longitude</label>
              <input type="number" id="longitude" step="0.0001" class="form-control" value="" min="-180.0000" max="180.0000" required>
            </div>
            <div class="col-md-2 mb-3">
              <label for="latitude">* Latitude</label>
              <input type="number" id="latitude" step="0.0001" class="form-control" value="" min="-90.0000" max="90.0000" required>
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
            <div class="col-md-3">
              <label for="logo">Upload an image as logo</label>
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
    <script src="js/geoConfig.js" charset="utf-8"></script>
    <script src="js/institution.js" charset="utf-8"></script>
  </body>
</html>
