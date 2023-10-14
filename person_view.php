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
    <input type="hidden" name="person" value="<?php echo $_GET['person']; ?>">
    <input type="hidden" name="sessionActive" value="<?php echo $sessionActive; ?>">
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <div class="row mb-3">
          <div class="col">
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom"></h2>
          </div>
        </div>

        <div class="row mb-3" id="statUsr">
          <div class="col-6">
            <div class="myCard myArtifacts bg-adc-light rounded">
              <div class="myCardBg"></div>
              <div class="myCardBody">
                <div class="myCardTitle"><p class="m-0">artifacts</p></div>
                <div class="myCardStat"><h2 class="m-0">0</h2></div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="myCard myModels bg-adc-light rounded">
              <div class="myCardBg"></div>
              <div class="myCardBody">
                <div class="myCardTitle"><p class="m-0">models</p></div>
                <div class="myCardStat"><h2 class="m-0">0</h2></div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col">
            <div class="card" id="personCard">
              <div class="card-header"><h6>Person metadata</h6></div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><span class="fw-bold">Email: </span><span id="email"></span></li>
                <li class="list-group-item"><span class="fw-bold">Institution: </span><span id="institution"></span></li>
                <li class="list-group-item"><span class="fw-bold">Position: </span><span id="position"></span></li>
                <li class="list-group-item"><span class="fw-bold">City: </span><span id="city"></span></li>
                <li class="list-group-item"><span class="fw-bold">Address: </span><span id="address"></span></li>
                <li class="list-group-item"><span class="fw-bold">Phone: </span><span id="phone"></span></li>
              </ul>
              <?php if(isset($_SESSION['id'])){?>
              <div class="card-footer">
                <a href="person_edit.php" class="btn btn-adc-dark btn-sm">edit person metadata</a>
              </div>
              <?php } ?>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col" id="usrDiv">
          <?php if(isset($_SESSION['id'])){?>
            <div class="alert alert-info text-center" role="alert"><span class="titleSection"></span> appears not to have a user profile, to create one simply fill in the following fields</div>
            <form id="usrFromPersonForm">
              <input type="hidden" name="person" id="person" value="<?php echo $_GET['person']; ?>">
              <div class="mb-3">
                <label for="role" class="col-sm-2 col-form-label">* Role</label>
                <select class="form-select form-select-sm" id="role" name="role" required>
                  <option selected disabled value="">-- select a value --</option>
                </select>
              </div>
              <div class="mb-3">
                <div class="form-check form-switch form-check-reverse text-start">
                  <input class="form-check-input" type="checkbox" id="is_active" name="is_active" checked>
                  <label class="form-check-label" for="is_active">
                    * Is active
                    <span class="mdi mdi-information-slab-circle" data-bs-toggle="tooltip" title="Leave checked if you want to allow the user to log in.<br />Uncheck if you don't want grant login permission to user.<br />You can modify this value later"></span>
                  </label>
                </div>
              </div>
              <div>
                <button type="submit" id="usrFromPersonBtn" class="btn btn-sm btn-adc-dark">create user profile</button>
              </div>
            </form>
          </div>
          <?php } ?>
        </div>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/person.js" charset="utf-8"></script>
  </body>
</html>
