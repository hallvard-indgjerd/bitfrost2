<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
    <link rel="stylesheet" href="css/dashboard.css">
  </head>
  <body>
    <?php 
      require("assets/header.php");
      require("assets/loadingDiv.html");  
    ?>
    
    <main class="animated mainSection">
      <input type="hidden" name="usrId" value="<?php echo $_SESSION['id']; ?>">
      <input type="hidden" name="usrCls" value="<?php echo $_SESSION['role']; ?>">
      <input type="hidden" name="usrInst" value="<?php echo $_SESSION['institution']; ?>">
      <div id="dashboardWrap" class="dashboardFlex">
        <div id="issuesSection" class="alert d-none d-lg-block">
          <h4 id="issuesTitle"></h4>
          <div id="issuesBody"></div>
        </div>
        <div id="artifactList" class="border rounded shadow p-3 mb-5">
          <h3>Artifact <span id="artifactStatusTitle"></span><span class="badge text-bg-dark float-end"></span></h3>
          <div class="toolbarDiv border-bottom">
            <div>
              <div class="btn-group btn-group-sm" role="group">
                <!-- <input type="radio" class="btn-check" name="artifactStatus" id="statusAll" value="0" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="statusAll">All</label> -->
                <input type="radio" class="btn-check" name="artifactStatus" id="statusComplete" value="2" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="statusComplete">Complete</label>
                <input type="radio" class="btn-check" name="artifactStatus" id="statusIncomplete" value="1" autocomplete="off">
                <label class="btn btn-outline-secondary" for="statusIncomplete">Under processing</label>
              </div>
            </div>
            <div>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="search by description" name="searchByDescription">
                <button class="btn btn-outline-secondary" type="button" name="searchByDescriptionBtn">search</button>
                <button class="btn btn-outline-secondary d-none" type="button" name="resetDescriptionBtn">reset</button>
              </div>
            </div>
          </div>
          <div class="list-group list-group-flush listDashBoard">
            <p class="list-group-item pe-4 fw-bold"><span>name</span><span>description</span><span>last update</span><span></span></p>
            <div class="listWrap"></div>
          </div>
        </div>
        <div id="modelList" class="border rounded shadow p-3 mb-5">
          <h3>Model <span id="modelStatusTitle"></span><span class="badge text-bg-dark float-end"></span></h3>
          <div class="toolbarDiv border-bottom">
            <div>
              <div class="btn-group btn-group-sm" role="group">
                <!-- <input type="radio" class="btn-check" name="modelStatus" id="modelStatusAll" value="0" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="modelStatusAll">All</label> -->
                <input type="radio" class="btn-check" name="modelStatus" id="modelStatusComplete" value="2" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="modelStatusComplete">Complete</label>
                <input type="radio" class="btn-check" name="modelStatus" id="modelStatusIncomplete" value="1" autocomplete="off">
                <label class="btn btn-outline-secondary" for="modelStatusIncomplete">Under processing</label>
              </div>
            </div>
          </div>
          <div class="dashboardFlex" id="modelDashboardGallery"></div>
        </div>
        <div id="mapWrap" class="border rounded shadow p-3 mb-5">
          <h3>Collection Map</h3>
          <div id="map"></div>
        </div>

        <div id="institutionList" class="border rounded shadow p-3">
          <h3>Institutions <span class="badge text-bg-dark float-end"></span></h3>
          <!-- <div class="toolbarDiv border-bottom">
            <div>
              <a href="institution_add.php" class="btn btn-sm btn-outline-secondary">add institution</a>
            </div>
          </div> -->
          <div class="btn-toolbar border-bottom mb-3 pb-1" role="toolbar">
            <div class="btn-group btn-sm me-2">
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownInstitutionCategory" data-bs-toggle="dropdown" aria-expanded="false">all categories</button>
              <ul class="dropdown-menu" id="listInstitutionCategory"></ul>
            </div>
            <div class="input-group input-group-sm">
              <input type="text" class="form-control" placeholder="search by name" name="searchByInstitutionName">
              <button class="btn btn-outline-secondary" type="button" name="searchByInstitutionNameBtn">search</button>
              <button class="btn btn-outline-secondary d-none" type="button" name="resetInstitutionNameBtn">reset</button>
            </div>
          </div>
          <div class="listWrap" id="institutionDasboardList"></div>
        </div>
        <div id="personList" class="border rounded shadow p-3">
          <h3>Persons <span class="badge text-bg-dark float-end"></span></h3>
          <!-- <div class="toolbarDiv border-bottom"> -->
            <!-- <div>
              <a href="persons_add.php?user=false" class="btn btn-sm btn-outline-secondary">add person</a>
            </div> -->
            <div class="btn-toolbar border-bottom mb-3 pb-1" role="toolbar">
              <div class="btn-group btn-sm me-2">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownPersons" data-bs-toggle="dropdown" aria-expanded="false">all persons</button>
                <ul class="dropdown-menu" id="listPersonCategory">
                  <li><button type="button" class="dropdown-item active" value="0">all persons</button></li>
                  <li><button type="button" class="dropdown-item" value="1">active user</button></li>
                  <li><button type="button" class="dropdown-item" value="2">disabled user</button></li>
                  <li><button type="button" class="dropdown-item" value="3">no account</button></li>
                </ul>
              </div>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="search" name="searchByPersonName">
                <button class="btn btn-outline-secondary" type="button" name="searchByPersonNameBtn">search</button>
                <button class="btn btn-outline-secondary d-none" type="button" name="resetPersonNameBtn">reset</button>
              </div>
            </div>
          <!-- </div> -->
          <ul class="list-group list-group-flush listDashBoard listWrap"></ul>
        </div>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
    <script src="js/maps/geo_config.js" charset="utf-8"></script>
    <script src="js/maps/geo_function.js" charset="utf-8"></script>
    <script src="js/dashboard.js" charset="utf-8"></script>
  </body>
</html>
