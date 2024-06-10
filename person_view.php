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
    <?php if($sessionActive == 1){
      echo '<input type="hidden" name="role" value="'.$_SESSION['role'].'">';
    } ?>
    <?php require("assets/header.php"); ?>
    <main class="animated mainSection">
      <div class="container">
        <div class="row mb-3">
          <div class="col">
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom"></h2>
          </div>
        </div>
        
        <div class="row mb-3 invisible" id="statUsr">
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
          <div class="col-md-6">
            <div class="card" id="personCard">
              <div class="card-header"><h6>Person info</h6></div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><span class="fw-bold">Email: </span><span id="email"></span></li>
                <li class="list-group-item"><span class="fw-bold">Institution: </span><span id="institution"></span></li>
                <li class="list-group-item"><span class="fw-bold">Position: </span><span id="position"></span></li>
                <li class="list-group-item"><span class="fw-bold">City: </span><span id="city"></span></li>
                <li class="list-group-item"><span class="fw-bold">Address: </span><span id="address"></span></li>
                <li class="list-group-item"><span class="fw-bold">Phone: </span><span id="phone"></span></li>
              </ul>
              <?php if(isset($_SESSION['id']) && $_SESSION['role'] < 3){?>
              <div class="card-footer">
                <a href="person_edit.php" class="btn btn-adc-dark btn-sm">edit person info</a>
              </div>
              <?php } ?>
            </div>
          </div>
          <?php if(isset($_SESSION['id'])){?>
          <div class="col-md-6 invisible" id="usrDiv">
            <div class="card">
              <div class="card-header"><h6>User info</h6></div>
              <ul class="list-group list-group-flush" id="userInfoList">
                <li class="list-group-item"><span class="fw-bold">is active: </span><span></span></li>
                <li class="list-group-item"><span class="fw-bold">role: </span><span></span></li>
                <li class="list-group-item"><span class="fw-bold">created at: </span><span></span></li>
              </ul>
              <?php if($_SESSION['role'] < 3){?>
              <div class="card-body">
                <form id="usrForm" class="">
                  <div class="alert alert-info text-center" role="alert"><span class="titleSection"></span> appears not to have a user profile, to create one simply fill in the following fields</div>
                  <input type="hidden" name="person" id="person" value="<?php echo $_GET['person']; ?>">
                  <div class="mb-3">
                    <label for="role" class="col-sm-2 col-form-label">* Role</label>
                    <select class="form-select form-select-sm" id="role" name="role" required>
                      <option selected disabled value="">-- select a value --</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-check-label" for="is_active">* Is active <span class="mdi mdi-information-slab-circle" data-bs-toggle="tooltip" title="Leave checked if you want to allow the user to log in.<br />Uncheck if you don't want grant login permission to user.<br />You can modify this value later"></span></label>
                    <div class="form-check form-switch ">
                      <input class="form-check-input" type="checkbox" id="is_active" name="is_active" checked>
                    </div>
                  </div>
                </form>
              </div>
              <div class="card-footer">
                <button type="submit" id="userBtn" class="btn btn-sm btn-adc-dark">edit user info</button>
              </div>
              <?php  } ?>
            </div>
          </div>
        <?php } ?>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/person.js" charset="utf-8"></script>
  </body>
</html>
