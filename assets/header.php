<header>
  <div id="headerLogo"></div>
  <div id="headerLink">
    <a href="index.php" class="animated d-none d-xl-inline-block">home</a>
    <a href="#" class="animated d-none d-xl-inline-block">about</a>
    <a href="#" class="animated d-none d-xl-inline-block">credits</a>
    <a href="db_model.php" class="animated d-none d-xl-inline-block">db model</a>
    <?php if (!isset($_SESSION['id'])) {?>
      <a href="login.php" class="animated">login</a>
    <?php }else { ?>
      <a href="#" id="toggleMenu"><span class="mdi mdi-menu"></span></a>
    <?php } ?>
  </div>
</header>
