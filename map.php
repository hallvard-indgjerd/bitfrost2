<?php require 'init.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <?php require("assets/meta.php"); ?>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
  <link rel="stylesheet" href="js/maps/mousePosition/mousePosition.css">
  <link rel="stylesheet" href="js/maps/mapScale/mapScale.css">
  <link rel="stylesheet" href="css/map.css">
</head>
<body>
  <?php require("assets/header.php"); ?>
  <main class="animated mainSection" id="mapWrap">
    <div id="loadingDiv"><p>...loading</p></div>
    <div id="map" class="mainSection">
    </div>
  </main>
  <?php
    require("assets/toastDiv.html");
    require("assets/menu.php");
    require("assets/js.html");
  ?>
  <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
  <script src="js/maps/geo_config.js" charset="utf-8"></script>
  <!-- <script src="js/maps/geo_function.js" charset="utf-8"></script> -->
  <script src="js/maps/mapScale/mapScale.js"></script>
  <script src="js/maps/mousePosition/mousePosition.js"></script>
  <script src="js/map.js" charset="utf-8"></script>
</body>
</html>