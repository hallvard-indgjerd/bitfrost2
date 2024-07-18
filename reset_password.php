<?php 
  require 'init.php'; 
  if (!isset($_GET['key'])) {header('Location: 403.php');}  
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/reset_password.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <?php require("assets/menu.php"); ?>
    <main class="d-flex flex-column align-items-center">
      <div id="tokenExpired"><h5></h5></div>
      <form name="resetPwd" id="resetPwd" class="invisible mt-5">
        <h6 class="bfc-txt">Use this form to create a new password for your account<br>
        Password must have 8 characters at least<br>
        If you prefer you can click on button "generate" to create a random password.</h6>
        <input type="hidden" name="token" id="token" value="<?php echo $_GET['key']; ?>">
        <label class="form-label" for="password">Enter password</label>
        <div class="input-group mb-3">
          <input type="password" class="form-control pwd" id="new_pwd" name="new_pwd" required>
          <button class="btn btn-outline-secondary" type="button" id="toggle-pwd">
            <i class="mdi mdi-eye"></i>
          </button>
          <button class="btn btn-outline-secondary" type="button" id="genPwd">
            generate
          </button>          
        </div>
        <div id="password-strength"><span></span></div> 
        <div id="pwdMsg" class="form-text"></div>
        <label for="confirm_pwd" class="form-label">Confirm password</label>
        <input type="password" class="form-control pwd" id="confirm_pwd" name="confirm_pwd" required>
        <div class="outputMsg my-3"></div>
        <button type="submit" name="resetPwdBtn" class="btn btn-primary">save password</button>
      </form>
    </main>
    <?php 
      require("assets/js.html"); 
      require("assets/toastDiv.html");
    ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.2.0/zxcvbn.js"></script>
    <script src="js/reset_password.js" charset="utf-8"></script>
  </body>
</html>
