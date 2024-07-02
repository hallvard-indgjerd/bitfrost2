<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" media="screen"/>
    <link href="https://cdn.maptiler.com/maptiler-sdk-js/v1.2.0/maptiler-sdk.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/artifacts.css">
    <link rel="stylesheet" href="css/map.css">
  </head>
  <body>
    <?php 
      require("assets/header.php");
      require("assets/loadingDiv.html"); 
      require("assets/itemtool.html"); 
    ?>
    

    <div id="statToggle" class="">
      <button type="button" class="btn btn-lg btn-secondary" name="statToggle">
        <span class="mdi mdi-chevron-left"></span>
      </button>
    </div>

    <div id="statWrap" class="statWrapVisible bg-light border animated mainSection">
      <div id="institution_chart" class="bg-white border rounded"></div>
      <div id="mapChart" class="bg-white border rounded">
        <div id="mapInfo" class="border rounded shadow">
          <h6 id="mapInfoTitle" class="m-0 text-secondary">Map info</h6>
          <div id="geomProp" class="text-center">
            <p class="mb-1 fw-bold" id="nameProp"></p>
            <p class="m-0" id="totProp"></p>
          </div>
        </div>
      </div>
      <div id="itemsCount" class="">
        <div class="border rounded bg-white text-center" id="artifactTot" >
          <h5 class="m-0 pt-2 fw-bold">Artifacts</h5>
          <h2 class="fs-1 fw-bold"></h2>
        </div>
        <div class="border rounded bg-white text-center" id="modelTot" >
          <h5 class="m-0 pt-2 fw-bold">Models</h5>
          <h2 class="fs-1 fw-bold"></h2>
        </div>
        <div class="border rounded bg-white text-center" id="institutionTot" >
          <h5 class="m-0 pt-2 fw-bold">Institutions</h5>
          <h2 class="fs-1 fw-bold"></h2>
        </div> 
        <div class="border rounded bg-white text-center" id="filesTot" >
          <h5 class="m-0 pt-2 fw-bold">Media</h5>
          <h2 class="fs-1 fw-bold"></h2>
        </div> 
      </div>
      <div id="crono_chart" class="bg-white border rounded"></div>
    </div>

    <main class="animated mainSection tab-content">
      <div class="tab-pane fade show active" id="gallery-pane" role="tabpanel">
        <div id="wrapGallery" class="card-wrap"></div>
      </div>
      <div class="tab-pane fade" id="collection-pane" role="tabpanel">
        <div class="bg-light border rounded py-3">
          <div id="emptyCollection" class="text-center">
            <h2>Your collection is empty!</h2>
          </div>
          <div id="fullCollection" class="container">
            <div class="row">
              <div class="col">
                <h3>Your Dynamic Collection</h3>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <p class="txt-adc-dark">In order to create a new collection we need your email to send you the direct link with which you can view the newly created collection.</p>
                <p class="txt-adc-dark">If you prefer not share your email you can download a json file with your collection</p>

                <button id="btExportCollection" type="button" class="btn btn-sm btn-secondary" data-bs-toggle="tooltip" title="Export collection as JSON">
                  <span class="mdi mdi-download"></span> Export
                </button>
                <button id="btImportCollection" type="button" class="btn btn-sm btn-secondary" data-bs-toggle="tooltip" title="Import collection from JSON">
                  <span class="mdi mdi-upload"></span> Import
                </button>
                <input type="file" id="ifileJSON" accept=".json,.JSON,.Json" style="display:none">

              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label for="collEmail" class="form-label">Email</label>
                  <input type="email" class="form-control form-control-sm" id="collEmail">
                </div>
                <div class="mb-3">
                  <label for="collAuthor" class="form-label">Author</label>
                  <input type="text" class="form-control form-control-sm" id="collAuthor" required>
                </div>                
                <div class="mb-3">
                  <label for="collTitle" class="form-label">Title</label>
                  <input type="text" class="form-control form-control-sm" id="collTitle" required>
                </div>
                <div class="mb-3">
                  <label for="collDesc" class="form-label">Description</label>
                  <textarea class="form-control form-control-sm" id="collDesc" rows="5"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="wrapCollection" class="card-wrap"></div>
      </div>
    </main>
    <?php
      require("assets/menu.php");
      require("assets/js.html"); 
    ?>
  </body>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v1.2.0/maptiler-sdk.umd.js"></script>
  <script src="https://cdn.maptiler.com/leaflet-maptilersdk/v2.0.0/leaflet-maptilersdk.js"></script>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script src="js/maps/geo_config.js" charset="utf-8"></script>
  <script src="js/maps/geo_function.js" charset="utf-8"></script>
  <script src="js/index.js" charset="utf-8"></script>
</html>
