<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/person_add.css">
    <link rel="stylesheet" href="css/settings.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <input type="hidden" id="user" value="<?php echo $_SESSION['id']; ?>">
        <input type="hidden" id="person" value="<?php echo $_SESSION['person']; ?>">
        <div class="row mb-3">
          <h3 class="border-bottom">Manage your data profile</h3>
          <div class="form-text">* mandatory field</div>
        </div>
        <?php 
          require('assets/changePwdForm.html');
          require('assets/usrMainFieldForm.html');
        ?>
      </div>
    </main>
    <?php 
      require("assets/menu.php");
      require("assets/toastDiv.html");
      require("assets/js.html"); 
    ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.2.0/zxcvbn.js"></script>
    <script src="js/persons.js"></script>
    <script src="js/settings.js"></script>
  </body>
</html>
