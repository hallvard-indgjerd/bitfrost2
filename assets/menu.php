<?php
$isMobile = isMobileCheck();
if (($isMobile == 0 && isset($_SESSION['id'])) || $isMobile == 1) {?>
<div id="backdrop"></div>
<nav class="animated">
  <div id="linkWrap">
    <?php if(isset($_SESSION['id'])){ ?>
      <span id="user"><?php echo $_SESSION['email']; ?></span>
      <a href='dashboard.php' class='animated' data-bs-toggle="tooltip" data-bs-placement="left" title="My dashboard. From this page you can manage your record and do many other funny things">
        <span class="mdi mdi-view-dashboard"></span>
        dashboard
      </a>
      <span class="titleSection">add resource</span>
      <a href='artifacts_add.php' class='animated' data-bs-toggle="tooltip" data-bs-placement="left" title="Artifacts gallery. From this page you can manage artifact">
        <span class="mdi mdi-axe"></span>
        artifact
      </a>
      <a href='model_add.php' class='animated' data-bs-toggle="tooltip" data-bs-placement="left" title="Models gallery. From this page you can manage model">
        <span class="mdi mdi-cube-outline"></span>
        model
      </a>
      <a href='#' class='animated' data-bs-toggle="tooltip" data-bs-placement="left" title="research insitutions, museum, university etc.">
        <span class="mdi mdi-bank"></span>
        institution
      </a>
      <a href='persons_add.php?user=false' class='animated'>
        <span class="mdi mdi-book-account"></span>
        person
      </a>
      <span class="titleSection">admin</span>
      <a href='persons_add.php?user=true' class='animated'>
        <span class="mdi mdi-account-group"></span>
        user
      </a>
      <a href='#' class='animated'>
        <span class="mdi mdi-format-list-bulleted-square"></span>
        vocabulary
      </a>
      <span class="titleSection">my account</span>
      <a href='settings.php' class='animated'>
        <span class="mdi mdi-cog"></span>
        settings
      </a>
      <a href='#' class='animated'>
        <span class="mdi mdi-image-multiple"></span>
        my collections
      </a>
      <a href="logout.php" class="animated">
        <span class="mdi mdi-logout-variant"></span>
        logout
      </a>
    <?php } ?>
    <span class="titleSection d-lg-none">main pages</span>
    <a href="index.php" class="animated d-lg-none">
      <span class="mdi mdi-home"></span>
      home
    </a>
    <a href="#" class="animated d-lg-none">
      <span class="mdi mdi-information-outline"></span>
      about
    </a>
    <a href="#" class="animated d-lg-none">
      <span class="mdi mdi-sign-direction"></span>
      milestones
    </a>
    <a href="#" class="animated d-lg-none">
      <span class="mdi mdi-handshake-outline"></span>
      partners
    </a>
    <?php if (!isset($_SESSION['id'])) {?>
      <a href="login.php" class="animated d-lg-none">
        <span class="mdi mdi-login-variant"></span>
        login
      </a>
    <?php } ?>
  </div>
</nav>
<?php } ?>
