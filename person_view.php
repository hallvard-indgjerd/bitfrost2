<?php
  require 'init.php';
  $sessionActive = isset($_SESSION['id']) ? 1 : 0;
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/person_view.css">
  </head>
  <body>
    <input type="hidden" name="person" value="<?php echo $_GET['item']; ?>">
    <input type="hidden" name="sessionActive" value="<?php echo $sessionActive; ?>">
    <?php if($sessionActive == 1){
      echo '<input type="hidden" name="role" value="'.$_SESSION['role'].'">';
    } ?>
    <?php require("assets/header.php"); ?>
    <div id="itemTool" class="animated mainSection">
      <a href="person.php?item=<?php echo $_GET['item']; ?>" class="btn btn-sm btn-light"><i class="mdi mdi-pencil"></i> edit profile</a>
    </div>
    <main class="animated mainSection">
      <div class="container">
        <div class="row mb-3">
          <div class="col">
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom"></h2>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="card" id="personCard">
              <div class="card-header"><h6>Person info</h6></div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <span class="fw-bold">Email: </span>
                  <span id="email"></span>
                </li>
                <li class="list-group-item">
                  <span class="fw-bold">Institution: </span>
                  <span id="institution"></span>
                </li>
                <li class="list-group-item">
                  <span class="fw-bold">Position: </span>
                  <span id="position"></span>
                </li>
                <li class="list-group-item">
                  <span class="fw-bold">City: </span>
                  <span id="city"></span>
                </li>
                <li class="list-group-item">
                  <span class="fw-bold">Address: </span>
                  <span id="address"></span>
                </li>
                <li class="list-group-item">
                  <span class="fw-bold">Phone: </span>
                  <span id="phone"></span>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-6" id="usrDiv">
            <div class="card">
              <div class="card-header">
                <h6>User info</h6>
              </div>
              <ul class="list-group list-group-flush d-none" id="userInfoList">
                <li class="list-group-item">
                  <span class="fw-bold">is active: </span>
                  <span id="is_active"></span>
                </li>
                <li class="list-group-item">
                  <span class="fw-bold">role: </span>
                  <span id="role"></span>
                </li>
                <li class="list-group-item">
                  <span class="fw-bold">created at: </span>
                  <span id="created_at"></span>
                </li>
              </ul>
              <div id="noUsrDiv" class="alert alert-danger d-none">
                <h5><span id="profileName"></span> does not have a registered account, edit profile to create a system user</h5>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col">
            <h5 class="p-3 bg-light border-bottom rounded">Artifacts created <span id="artNum" class="badge text-bg-dark float-end"></span></h5>
            <div id="noArtifacts" class="alert alert-info d-none">NO artifacts created by user</div>
            <div id="artifactsWrap" class="objWrap d-none table-responsive">
              <table id="artifactsTable" class="table table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Description</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody id="artifactRows"></tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <h5 class="p-3 bg-light border-bottom rounded">Models file created <span id="modNum" class="badge text-bg-dark float-end"></h5>
            <div id="noModels" class="alert alert-info d-none">No artifacts created by user</div>
            <div id="modelsWrap" class="objWrap d-none"></div>
          </div>
        </div>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/person.js" charset="utf-8"></script>
  </body>
</html>
