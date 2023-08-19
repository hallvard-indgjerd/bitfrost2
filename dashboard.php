<?php
  require 'init.php';
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
          <h3>Artifact</h3>
          <div class="toolbarDiv border-bottom">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check" name="artifactStatus" id="statusAll" value="0" autocomplete="off" checked>
              <label class="btn btn-outline-secondary" for="statusAll">All</label>
              <input type="radio" class="btn-check" name="artifactStatus" id="statusComplete" value="2" autocomplete="off">
              <label class="btn btn-outline-secondary" for="statusComplete">Complete</label>
              <input type="radio" class="btn-check" name="artifactStatus" id="statusIncomplete" value="1" autocomplete="off">
              <label class="btn btn-outline-secondary" for="statusIncomplete">Under processing</label>
            </div>
          </div>
        </div>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/dashboard.js" charset="utf-8"></script>
  </body>
</html>
