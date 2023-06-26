<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="css/artifacts.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <nav class="itemTool <?php echo $itemToolClass; ?>">
        <div class="container-fluid">
          <div class="d-inline-block me-1">
            <button class="btn btn-light btn-sm" type="button" id="resetGallery" data-bs-toggle="tooltip" data-bs-title="reset filters" style="margin-top:-5px"><span class="mdi mdi-reload"></span></button>
          </div>
          <div class="d-inline-block me-1">
            <select class="form-select form-select-sm buildGallery" id="byCategory">
              <option selected value="" disabled>search by category</option>
            </select>
          </div>
          <div class="d-inline-block me-1">
            <select class="form-select form-select-sm buildGallery"id="byMaterial">
              <option selected value="" disabled>search by material</option>
            </select>
          </div>
          <div class="d-inline-block me-1">
            <select class="form-select form-select-sm buildGallery" id="byChronology">
              <option selected value="" disabled>search by chronology</option>
            </select>
          </div>
          <div class="d-inline-block me-1">
            <div class="input-group input-group-sm">
              <input type="search" class="form-control w-auto" id="byDescription" value="">
              <button class="btn btn-light buildGallery" type="button"><span class="mdi mdi-magnify"></span></button>
            </div>
          </div>
          <div class="d-inline-block me-1">
            <div class="btn-group">
              <button class="btn bg-adc-dark btn-sm" type="button" id="createFromFiltered" data-bs-toggle="tooltip" data-bs-title="create a new collection from filtered items" style="margin-top:-5px">create collection</button>
            </div>
          </div>
          <div class="dropdown float-end me-3">
            <button class="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" id="sortByBtn"><span class="mdi mdi-sort-reverse-variant"></span></button>
            <ul class="dropdown-menu" id="sortBy">
              <li><a class="dropdown-item sortBy" href="#" data-sort="category">name</a></li>
              <li><a class="dropdown-item sortBy" href="#" data-sort="material">material</a></li>
              <li><a class="dropdown-item sortBy" href="#" data-sort="start">chronology</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <div id="viewCollection">
        <button type="button" class="btn btn-adc-dark" name="viewCollectionBtn" data-bs-toggle="modal" data-bs-target="#saveCollectionModal">view your collection</button>
        <!-- data-bs-toggle="modal" data-bs-target="#saveCollectionModal" -->
      </div>
      <div class="container-fluid mt-5">
        <div class="row">
          <div class="col text-center">
            <h1 id="totItems" class="txt-adc-dark fw-bold"></h1>
          </div>
        </div>
        <div class="card-wrap"></div>
      </div>
    </main>

    <div class="modal fade" id="saveCollectionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xxl">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Create your collection</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-8">
                    <div id="wrapCollected"></div>
                  </div>
                  <div class="col-md-4">
                    <p class="txt-adc-dark m-0">In order to create a new collection we need your email to send you the direct link with which you can view the newly created collection.</p>
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control form-control-sm" id="email" required>
                    </div>
                    <p class="txt-adc-dark m-0">If you prefer, you can create a user account with which you will be able to manage your collections more easily.</p>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" value="1" id="createAccount" name="createAccount">
                      <label class="form-check-label" for="createAccount">Ok, create an account</label>
                    </div>
                    <p class="txt-adc-dark m-0">Please insert a title and a brief description for the collection</p>
                    <div class="mb-2">
                      <label for="title" class="form-label">title</label>
                      <input type="text" class="form-control form-control-sm" id="title" required>
                    </div>
                    <div class="mb-3">
                      <label for="description" class="form-label">Brief description</label>
                      <textarea class="form-control form-control-sm" id="description" rows="10"></textarea>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Create collection</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <?php require("assets/menu.php"); ?>
    <?php require("assets/js.html"); ?>
  </body>
  <script src="js/index.js" charset="utf-8"></script>
</html>
