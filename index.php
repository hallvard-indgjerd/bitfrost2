<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" media="screen"/>
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/artifacts.css">
  </head>
  <body>
    <?php 
      require("assets/header.php"); 
      require("assets/loadingDiv.html"); 
    ?>
    <div id="itemTool" class="animated mainSection <?php echo $mainClass; ?>">
      <div id="viewCollection" class="d-inline-block me-1">
        <button type="button" class="btn btn-adc-dark" name="viewCollectionBtn" data-bs-toggle="modal" data-bs-target="#saveCollectionModal">view your collection</button>
      </div>
        <div class="d-inline-block me-1">
          <button class="btn btn-light btn-sm" type="button" id="resetGallery" data-bs-toggle="tooltip" data-bs-title="reset filters" style="margin-top:-5px"><span class="mdi mdi-reload"></span></button>
        </div>
        <div class="d-inline-block me-1">
          <select class="form-select form-select-sm buildGallery" id="byCategory">
            <option selected value="" disabled>search by category</option>
          </select>
        </div>
        <div class="d-inline-block me-1">
          <select class="form-select form-select-sm buildGallery"id="byMaterial">
            <option selected value="" disabled>search by material</option>
          </select>
        </div>
        <div class="d-inline-block me-1">
          <select class="form-select form-select-sm buildGallery" id="byChronology">
            <option selected value="" disabled>search by chronology</option>
          </select>
        </div>
        <div class="d-inline-block me-1">
          <div class="input-group input-group-sm">
            <input type="search" class="form-control w-auto" id="byDescription" value="">
            <button class="btn btn-light byDescription" type="button"><span class="mdi mdi-magnify"></span></button>
          </div>
        </div>
        <div class="d-inline-block me-1">
          <div class="btn-group">
            <button class="btn bg-adc-dark btn-sm" type="button" id="createFromFiltered" data-bs-toggle="tooltip" data-bs-title="create a new collection from filtered items" style="margin-top:-5px">create collection</button>
          </div>
        </div>
        <div class="dropdown float-end me-3">
          <button class="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" id="sortByBtn"><span class="mdi mdi-sort-reverse-variant"></span></button>
          <ul class="dropdown-menu" id="sortBy">
            <li><a class="dropdown-item sortBy" href="#" data-sort="category">name</a></li>
            <li><a class="dropdown-item sortBy" href="#" data-sort="material">material</a></li>
            <li><a class="dropdown-item sortBy" href="#" data-sort="start">chronology</a></li>
          </ul>
        </div>
    </div>

    <div id="statToggle" class="">
      <button type="button" class="btn btn-lg btn-secondary" name="statToggle">
        <span class="mdi mdi-chevron-left"></span>
      </button>
    </div>

    <div id="statWrap" class="statWrapVisible bg-light border animated mainSection <?php echo $mainClass; ?>">
      <div class="">
        <div class="border rounded bg-white text-center" id="artifactTot" >
          <h6>Artifact</h6>
          <h2 class="fs-1"></h2>
        </div>
        <div class="border rounded bg-white text-center" id="modelTot" >
          <h6>Model</h6>
          <h2 class="fs-1"></h2>
        </div>
        <div class="border rounded bg-white text-center" id="institutionTot" >
          <h6>Institution</h6>
          <h2 class="fs-1"></h2>
        </div> 
        <div class="border rounded bg-white text-center" id="filesTot" >
          <h6>Media</h6>
          <h2 class="fs-1"></h2>
        </div> 
      </div>
      <div class="bg-white border rounded" id="mapStat"></div>
      <div class="bg-white border rounded" id="chartStat">
        <div id="institution_chart"></div>
        <div id="crono_chart"></div>
      </div>
    </div>

    <main class="animated mainSection <?php echo $mainClass; ?>">
      <div class="card-wrap" id="wrapCard"></div>
    </main>

    <div class="modal fade" id="saveCollectionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xxl">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Create your collection</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-8">
                    <div id="wrapCollected"></div>
                  </div>
                  <div class="col-md-4">
                    <p class="txt-adc-dark m-0">In order to create a new collection we need your email to send you the direct link with which you can view the newly created collection.</p>
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control form-control-sm" id="email" required>
                    </div>
                    <p class="txt-adc-dark m-0">Please insert a title and a brief description for the collection</p>
                    <div class="mb-2">
                      <label for="title" class="form-label">title</label>
                      <input type="text" class="form-control form-control-sm" id="title" required>
                    </div>
                    <div class="mb-3">
                      <label for="description" class="form-label">Brief description</label>
                      <textarea class="form-control form-control-sm" id="description" rows="10"></textarea>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Create collection</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
  </body>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script src="js/maps/geo_config.js" charset="utf-8"></script>
  <script src="js/maps/geo_function.js" charset="utf-8"></script>
  <script src="js/index.js" charset="utf-8"></script>
</html>
