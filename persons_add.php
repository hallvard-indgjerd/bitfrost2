<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/person_add.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <form name="newPersonForm">
          <input type="hidden" name="user" value="<?php echo $_GET['user']; ?>">
          <div class="row mb-3">
            <h3 class="border-bottom">New Person</h3>
          </div>
          <div class="row mb-3">
            <h5 class="text-danger bg-light p-2 border rounded">Mandatory field</h5>
            <label for="first_name" class="col-sm-2 col-form-label text-danger">First name</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="first_name" name="first_name" required>
            </div>
          </div>
          <div class="row mb-3">
            <label for="last_name" class="col-sm-2 col-form-label text-danger">Last name</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="last_name" name="last_name" required>
            </div>
          </div>
          <div class="row mb-3">
            <label for="email" class="col-sm-2 col-form-label text-danger">Email</label>
            <div class="col-sm-10">
              <input type="email" class="form-control" id="email" name="email" required>
            </div>
          </div>
          <?php if($_GET['user'] == 'true'){ ?>
          <div class="row mb-3 userField">
            <label for="role" class="col-sm-2 col-form-label text-danger">Role</label>
            <div class="col-sm-10">
              <select class="form-select" id="role" name="role">
                <option selected disabled>-- select a value --</option>
              </select>
            </div>
          </div>
          <div class="row mb-3 userField">
            <div class="col-3">
              <div class="form-check form-switch form-check-reverse text-start">
                <input class="form-check-input" type="checkbox" id="is_active" name="is_active" checked>
                <label class="form-check-label text-danger" for="is_active">
                  <span class="mdi mdi-information-slab-circle" data-bs-toggle="tooltip" title="Leave checked if you want to allow the user to log in.<br />Uncheck if you don't want grant login permission to user.<br />You can modify this value later"></span>
                  Is active
                </label>
              </div>
            </div>
          </div>
        <?php } ?>
          <div class="row mb-3">
            <h5 class="bg-light p-2 border rounded">Affiliation and job position</h5>
            <label for="institution" class="col-sm-2 col-form-label">Institution</label>
            <div class="col-sm-10">
              <select class="form-select" id="institution" name="institution">
                <option selected value="">-- select a value --</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <label for="position" class="col-sm-2 col-form-label">Position</label>
            <div class="col-sm-10">
              <select class="form-select" id="position" name="position">
                <option selected value="">-- select a value --</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <h5 class="bg-light p-2 border rounded">Personal information</h5>
            <label for="city" class="col-sm-2 col-form-label">City</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="city" name="city">
            </div>
          </div>
          <div class="row mb-3">
            <label for="address" class="col-sm-2 col-form-label">Address</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="address" name="address">
            </div>
          </div>
          <div class="row mb-3">
            <label for="phone" class="col-sm-2 col-form-label">Phone</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="phone" name="phone">
            </div>
          </div>
          <button type="submit" name="newPerson" class="btn btn-warning">save item</button>
        </form>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/person_add.js" charset="utf-8"></script>
  </body>
</html>
