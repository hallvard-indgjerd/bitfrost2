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
      <form class="form-sm" name="addUser">
        <h2 id="title" class="mb-3"></h2>
        <label class="form-label" for="name">Name</label>
        <input type="text" class="form-control mb-3" name="name" value="" id="name" required>
        <label class="form-label" for="email">Email</label>
        <input type="email" class="form-control mb-3" id="email" name="email" required>
        <div id="admin">
          <label class="form-label" for="password">Password</label>
          <div class="input-group mb-3">
            <input type="password" id="password" name="password" class="form-control">
            <button class="btn btn-outline-secondary" type="button" id="toggle-pwd"><i class="mdi mdi-eye"></i></button>
            <button class="btn btn-outline-secondary" type="button" id="gen-pwd"><i class="mdi mdi-lock-plus"></i></button>
          </div>
        </div>
        <div id="noAdmin">
          <label class="form-label" for="role">Role</label>
          <select class="form-select mb-3" id="role" name="role" aria-label="Default select example" required>
            <option value="" selected disabled>--select a role--</option>
          </select>
          <div class="form-check">
            <label class="form-check-label" for="is_active">Is active</label>
            <input class="form-check-input" type="checkbox" value="1" name="is_active" id="is_active" checked>
          </div>
        </div>
        <div class="outputMsg my-3"></div>
        <button type="submit" name="loginBtn" class="btn btn-primary" data-form="addUser">create user</button>
        <a href="index.php" class="btn btn-secondary">cancel request</a>
      </form>
    </main>
    <?php require("assets/js.html"); ?>
    <script src="js/addUser.js" charset="utf-8"></script>
  </body>
</html>
