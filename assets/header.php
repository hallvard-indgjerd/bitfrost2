<header>
  <div class="container-fluid">
    <div class="row">
      <div class="col-11 col-lg-8">
        <img src="img/ico/headerLogo.png" class="img-fluid d-inline" alt="">
        <h2 class="m-0 ps-xl-3 d-inline-block align-middle">Archaeological Dynamic Collections</h2>
      </div>
      <div class="col-1 col-lg-4">
        <div class="headerLink d-xl-none">
          <a href="#" id="toggleMenu"><i class="mdi mdi-dots-vertical"></i></a>
        </div>
        <div class="headerLink d-none d-xl-inline-block">
          <a href="index.php" class="animated">home</a>
          <a href="#" class="animated">about</a>
          <a href="#" class="animated">partners</a>
          <a href="db_model.php" class="animated">db model</a>
          <?php if (!isset($_SESSION['id'])) {?><a href="login.php" class="animated">login</a><?php } ?>
        </div>
        </div>
      </div>
    </div>
  </div>
</header>
