<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/dashboard.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div id="dashboardWrap">
        <div id="artifactList" class="border rounded shadow p-3">
          <h3>Artifact <span id="artifactStatusTitle"></span><span class="badge text-bg-dark float-end"></span></h3>
          <div class="toolbarDiv border-bottom">
            <div>
              <div class="btn-group btn-group-sm" role="group">
                <input type="radio" class="btn-check" name="artifactStatus" id="statusAll" value="0" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="statusAll">All</label>
                <input type="radio" class="btn-check" name="artifactStatus" id="statusComplete" value="2" autocomplete="off">
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
            <a class="list-group-item pe-4 fw-bold disabled"><span>id</span><span>name</span><span>description</span><span>last update</span></a>
            <div class="listWrap"></div>
          </div>
        </div>
        <div id="modelList" class="border rounded shadow p-3">
          <h3>Model <span id="modelStatusTitle"></span><span class="badge text-bg-dark float-end"></span></h3>
          <div class="toolbarDiv border-bottom">
            <div>
              <div class="btn-group btn-group-sm" role="group">
                <input type="radio" class="btn-check" name="modelStatus" id="modelStatusAll" value="0" autocomplete="off" checked>
                <label class="btn btn-outline-secondary" for="modelStatusAll">All</label>
                <input type="radio" class="btn-check" name="modelStatus" id="modelStatusComplete" value="2" autocomplete="off">
                <label class="btn btn-outline-secondary" for="modelStatusComplete">Complete</label>
                <input type="radio" class="btn-check" name="modelStatus" id="modelStatusIncomplete" value="1" autocomplete="off">
                <label class="btn btn-outline-secondary" for="modelStatusIncomplete">Under processing</label>
              </div>
            </div>
          </div>
          <div class="" id="modelDashboardGallery"></div>
        </div>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/dashboard.js" charset="utf-8"></script>
  </body>
</html>
