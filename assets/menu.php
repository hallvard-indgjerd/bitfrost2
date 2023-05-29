<?php
$isMobile = isMobileCheck();
if (($isMobile == 0 && isset($_SESSION['id'])) || $isMobile == 1) {?>
<div id="backdrop"></div>
<nav class="animated">
  <div id="linkWrap">
    <?php if(isset($_SESSION['id'])){ ?>
      <span id="user"><?php echo $_SESSION['email']; ?></span>
      <span class="titleSection">resources</span>
      <a href='models.php' class='animated'>models</a>
      <a href='artifacts.php' class='animated'>artifacts</a>
      <a href='#' class='animated'>runes</a>
      <a href='#' class='animated'>buildings</a>
      <a href='#' class='animated' data-bs-toggle="tooltip" data-bs-placement="left" title="research insitutions, museum, university etc.">institutions</a>
      <a href='persons.php' class='animated'>persons</a>
      <span class="titleSection">admin</span>
      <a href='#' class='animated'>users</a>
      <a href='#' class='animated'>vocabularies</a>
      <span class="titleSection">my account</span>
      <a href='#' class='animated'>settings</a>
      <a href='#' class='animated'>my collections</a>
      <a href="logout.php" class="animated">logout</a>
    <?php } ?>
    <span class="titleSection d-lg-none">main pages</span>
    <a href="index.php" class="animated d-lg-none">home</a>
    <a href="#" class="animated d-lg-none">about</a>
    <a href="#" class="animated d-lg-none">milestones</a>
    <a href="#" class="animated d-lg-none">partners</a>
    <?php if (!isset($_SESSION['id'])) {?>
      <a href="login.php" class="animated d-lg-none">login</a>
    <?php } ?>
  </div>
</nav>
<?php } ?>
