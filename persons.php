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
      <nav class="itemTool">
        <div class="container-fluid">
          <a href="persons_add.php" class="btn btn-dark">add item</a>
        </div>
      </nav>
      <div class="container mt-5">
        <table class="table" id="personsList">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Name</th>
              <th scope="col">email</th>
              <th scope="col">is user</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody class="table-group-divider"></tbody>
        </table>
      </div>
    </main>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
    <script src="js/persons.js" charset="utf-8"></script>
  </body>
</html>
