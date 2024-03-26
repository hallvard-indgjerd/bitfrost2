<header>
  <input type="hidden" name="logged" value="<?php echo $logged; ?>">
  <div id="headerLogo"></div>
  <div id="headerLink">
    <a href="index.php" class="animated d-none d-lg-inline-block">home</a>
    <a href="#" class="animated d-none d-lg-inline-block">about</a>
    <a href="#" class="animated d-none d-lg-inline-block">credits</a>
    <a href="db_model.php" class="animated d-none d-lg-inline-block">db model</a>
    <?php 
      if (!isset($_SESSION['id'])) {echo '<a href="login.php" class="animated d-none d-lg-inline-block">login</a>';}
    ?>
    <a href="#" id="toggleMenu"><span class="mdi mdi-menu"></span></a>
  </div>
</header>
