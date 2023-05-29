<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <form name="newPersonForm">
          <div class="row mb-3">
            <h3 class="border-bottom">New Person</h3>
          </div>
          <div class="row mb-3">
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
            <label for="email" class="col-sm-2 col-form-label">email</label>
            <div class="col-sm-10">
              <input type="email" class="form-control" id="email" name="email">
            </div>
          </div>
          <div class="row mb-3">
            <label for="institution" class="col-sm-2 col-form-label">Institution</label>
            <div class="col-sm-10">
              <select class="form-select" id="institution" name="institution">
                <option selected disabled>select a value</option>
                <option value="1">Lund University</option>
                <option value="2">Lund Museum</option>
                <option value="3">Blekinge Museum</option>
                <option value="4">...</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <label for="position" class="col-sm-2 col-form-label">Position</label>
            <div class="col-sm-10">
              <select class="form-select" id="position" name="position">
                <option selected disabled>select a value</option>
                <option value="1">Professor</option>
                <option value="2">Researcher</option>
                <option value="3">PhD</option>
                <option value="4">Student</option>
                <option value="5">...</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <label for="city" class="col-sm-2 col-form-label">City</label>
            <div class="col-sm-10">
              <select class="form-select" id="city" name="city">
                <option selected disabled>select a value</option>
                <option value="1">Lund</option>
                <option value="2">Malmo</option>
                <option value="3">Trento</option>
                <option value="4">Pisa</option>
                <option value="5">...</option>
              </select>
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
          <fieldset class="row mb-3">
            <legend class="col-form-label col-sm-2 pt-0">User account</legend>
            <div class="col-sm-10">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="gridCheck1">
                <label class="form-check-label" for="gridCheck1">
                Create an account for the person
                </label>
              </div>
            </div>
          </fieldset>
          <button type="submit" name="newPerson" class="btn btn-warning">save item</button>
        </form>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/persons.js" charset="utf-8"></script>
  </body>
</html>
