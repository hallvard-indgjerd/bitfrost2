<?php require 'init.php'; ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <?php require("assets/menu.php"); ?>
    <main class="d-flex flex-column align-items-center">
      <form class="" name="login">
        <label class="form-label" for="email">Email</label>
        <input type="email" class="form-control mb-3" id="email" name="email" required>
        <label class="form-label" for="password">Password</label>
        <div class="input-group mb-3">
          <input type="password" id="password" name="password" class="form-control">
          <button class="btn btn-outline-secondary" type="button" id="toggle-pwd">
            <i class="mdi mdi-eye"></i>
          </button>
        </div>
        <div class="outputMsg my-3"></div>
        <button type="submit" name="loginBtn" class="btn btn-primary" data-form="login">login</button>
        <button type="button" name="toggleRescue" class="btn btn-secondary">forgot password</button>
      </form>
      <form name="rescuePwd" id="rescuePwd" class="mt-5">
        <h6 class="bfc-txt">If you don't remember your password, enter the email you used when registering and we'll send you a new one</h6>
        <label class="form-label" for="email4Rescue">Email</label>
        <input type="email" class="form-control mb-3" id="email4Rescue" name="email4Rescue" required>
        <div class="outputMsg text-center my-3"></div>
        <button type="submit" name="rescuePwdBtn" class="btn btn-primary" data-form="rescuePwd">send me a new password</button>
        <button type="button" name="toggleRescue" class="btn btn-secondary">cancel request</button>
      </form>
    </main>
    <?php require("assets/js.html"); ?>
    <script src="js/login.js" charset="utf-8"></script>
  </body>
</html>
