<?php
  require 'init.php';
  if (!isset($_SESSION['id'])) { header('Location: 403.php');}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.4/css/bootstrap5-toggle.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/artifacts_add.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <main class="<?php echo $mainClass; ?>">
      <div class="container">
        <input type="hidden" name="usr" value="<?php echo $_SESSION['id']; ?>">
        <div class="text-center border rounded bg-light mb-3 p-3">
          <h5 class="text-muted text-center">you are modifying the metadata of the artifact:</h5>
          <h1 id="pageTitle" class="text-center txt-adc-dark"></h1>
        </div>
        <form name="newArtifactForm" enctype="multipart/form-data" method="post">
          <input type="hidden" name="artifact" id="artifact" data-table="artifact" value="<?php echo $_GET['item']; ?>">
          <fieldset>
            <legend>Main data</legend>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="name" class="text-danger fw-bold">Name</label>
                <div class="input-group mb-3">
                  <input type="text" class="form-control" placeholder="name" data-table="artifact" id="name" required>
                  <button class="btn btn-warning" type="button" name="checkNameBtn">check name</button>
                  <span class="input-group-text bg-info" style="cursor:pointer" data-bs-toggle="tooltip" title="Fill in the 'name'field with a value that help you to easily identify the artifact. Remember that you cannot use the same value for different artifacts. To verify if the name already exists, you can insert the value and click the button 'check name', a messagge will appears. If you don't check the value now, the system will do it for you when you save the record'"><i class="mdi mdi-help-circle-outline"></i></span>
                </div>
                <div id="checkNameResult"></div>
              </div>
              <div class="col-md-3">
                <label for="status" class="fw-bold text-danger">Status item</label>
                <select name="status" id="status" class="form-select" data-table="artifact" required>
                  <option value="1">under processing</option>
                  <option value="2">complete data</option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="description" class="fw-bold text-danger">Description</label>
                  <textarea data-table="artifact" id="description" rows="8" class="form-control" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="notes">Main data notes</label>
                  <textarea data-table="artifact" id="notes" rows="5" class="form-control"></textarea>
                </div>
              </div>

              <div class="col-md-6">
                <div class="wrapfield">
                  <div class="align-top">
                    <label for="category_class" class="fw-bold text-danger">Category class</label>
                    <select class="form-select" id="category_class" data-table="artifact" required>
                      <!-- <option value="" selected disabled>-- select value --</option> -->
                    </select>
                  </div>
                  <div class="align-top">
                    <label for="category_specs">Category specification</label>
                    <select class="form-select" id="category_specs" data-table="artifact" value=""></select>
                    <div id="catSpecsMsg" class="form-text text-danger">No specifications available</div>
                  </div>
                </div>
                <div class="wrapfield">
                  <label for="type">Typology</label>
                  <input type="text" class="form-control" id="type" data-table="artifact" value="">
                </div>
                <div class="wrapfield">
                  <div class="material">
                    <label for="material" class="fw-bold text-danger">Material</label>
                    <select class="form-select" id="material">
                      <option value="" selected disabled>-- select value --</option>
                      <optgroup id="matClass" label="generic value"></optgroup>
                      <optgroup id="matSpecs" label="specific value"></optgroup>
                    </select>
                  </div>
                  <div class="technique">
                    <label for="technique">
                      <i class="mdi mdi mdi-information-slab-circle-outline" data-bs-toggle="tooltip" title="the field is not mandatory but it is strongly recommended to fill it in to have more complete data"></i>
                      Technique
                    </label>
                    <div class="input-group">
                      <input type="text" id="technique" class="form-control" value="">
                      <button type="button" name="confirmMaterial" class="btn btn-success" data-bs-toggle="tooltip" title="click button to add a new material/technique definition">add</button>
                    </div>
                  </div>
                </div>
                <div id="matTechArray"></div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Chronological definition</legend>
            <div class="row">
              <div class="col">
                <legend>Lower bound</legend>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="startGenericList">Filter start year by generic cultural period definition</label>
                <select class="form-select" id="startGenericList">
                  <option value="">-- no filter --</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="startSpecificList">Filter start year by specific cultural period definition</label>
                <select class="form-select" id="startSpecificList" disabled></select>
              </div>
              <div class="col-md-4">
                <label for="start" class="fw-bold text-danger">Start year</label>
                <input type="number" class="form-control w-auto" id="start" step="1" data-table="artifact" value="" min="-3000000" max="<?php echo Date('Y'); ?>" required>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <legend>Upper bound</legend>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="endGenericList">Filter end year by generic cultural period definition</label>
                <select class="form-select" id="endGenericList" disabled></select>
              </div>
              <div class="col-md-4">
                <label for="endSpecificList">Filter end year by specific cultural period definition</label>
                <select class="form-select" id="endSpecificList" disabled></select>
              </div>
              <div class="col-md-4">
                <label for="end" class="fw-bold text-danger">End year</label>
                <input type="number" class="form-control w-auto" id="end" step="1" data-table="artifact" value="" min="-3000000" max="<?php echo Date('Y'); ?>" required>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Conservation info</legend>
            <div class="row mb-3">
              <div class="col-md-3">
                <label for="storage_place" class="fw-bold text-danger">Storage place</label>
                <select class="form-select" id="storage_place" data-table="artifact" required></select>
              </div>
              <div class="col-md-3">
                <label for="inventory">Inventory</label>
                <input type="text" id="inventory" class="form-control" data-table="artifact" value="">
              </div>
              <div class="col-md-2">
                <label for="conservation_state" class="fw-bold text-danger">Conservation state</label>
                <select class="form-select" id="conservation_state" data-table="artifact" required></select>
              </div>
              <div class="col-md-2">
                <label for="object_condition">Object condition</label>
                <select class="form-select" id="object_condition" data-table="artifact">
                  <option value="" selected disabled>-- select a value --</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="me-3 d-block">is museum copy</label>
                <input type="checkbox" class="btn-check" id="is_museum_copy" autocomplete="off">
                <label class="btn btn-outline-success d-block" for="is_museum_copy">No</label>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Find site</legend>
            <div class="row mb-3">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="county" class="fw-bold text-danger">County</label>
                  <select data-table="artifact_findplace" class="form-select" id="county" required>
                    <option value="" selected disabled>-- select county --</option>
                  </select>
                </div>
                <div id="cityWrap" class="mb-3">
                  <label for="city">City</label>
                  <input id="city" type="text" name="city" class="form-control" value="" placeholder="digit city name" data-cityid=''>
                  <div id="cityMsg" class="form-text text-danger">No city selected</div>
                  <div class="list-group" id="citySuggested"></div>
                </div>
                <div class="mb-3">
                  <label for="parish">Parish</label>
                  <input data-table="artifact_findplace" type="text" id="parish" value="" class="form-control">
                </div>
                <div class="mb-3">
                  <label for="toponym">Toponym</label>
                  <input data-table="artifact_findplace" type="text" id="toponym" value="" class="form-control">
                </div>
                <div class="mb-3 wrapfield">
                  <div class="">
                    <label for="longitude">Longitude</label>
                    <input data-table="artifact_findplace" type="number" id="longitude" step="0.0001" class="form-control" value="" min="-180.0000" max="180.0000">
                  </div>
                  <div class="">
                    <label for="latitude">Latitude</label>
                    <input data-table="artifact_findplace" type="number" id="latitude" step="0.0001" class="form-control" value="" min="-90.0000" max="90.0000">
                  </div>
                </div>
                <div class="mb-3">
                  <label for="findplace_notes">Notes about position</label>
                  <textarea data-table="artifact_findplace" id="findplace_notes" rows="5" class="form-control"></textarea>
                </div>
              </div>
              <div class="col-md-8">
                <div id="map">
                  <div class="alert alert-warning" id="mapAlert">To put a marker on map you have to zoom in</div>
                  <div id="resetMapDiv">
                    <button type="button" class="btn btn-sm btn-light" data-bs-toggle="tooltip" title="remove all elements from map, reset field value and restore the initial zoom extent" name="resetMap">reset map value</button>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Metadata</legend>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="author" class="fw-bold text-danger">Author</label>
                <select data-table="artifact" class="form-select" id="author" required></select>
              </div>
              <div class="col-md-4">
                <label for="owner" class="fw-bold text-danger">Owner</label>
                <select data-table="artifact" class="form-select" id="owner" required>
                  <option value="" selected disabled>-- select value --</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="license" class="fw-bold text-danger">License</label>
                <select data-table="artifact" class="form-select" id="license" required>
                  <option value="" selected disabled>-- select license --</option>
                </select>
              </div>
            </div>
            <button type="submit" name="editArtifact" class="btn btn-warning">save item</button>
            <a href="dashboard.php" class="btn btn-primary">cancel</a>
          </fieldset>
        </form>
      </div>
    </main>
    <?php
      require("assets/toastDiv.html");
      require("assets/menu.php");
      require("assets/js.html");
    ?>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.4/js/bootstrap5-toggle.ecmas.min.js"></script>
    <script src="js/geoConfig.js" charset="utf-8"></script>
    <script src="js/artifact_add.js" charset="utf-8"></script>
    <script src="js/chronologyFunc.js" charset="utf-8"></script>
    <script src="js/artifact_edit.js" charset="utf-8"></script>
  </body>
</html>
