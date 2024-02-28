<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" media="screen"/>
    <link rel="stylesheet" href="css/artifact_view.css">
    <link rel="stylesheet" href="css/my3dhop.css">
  </head>
  <body>
    <?php 
      require("assets/header.php"); 
      require("assets/loadingDiv.html"); 
    ?>
    <main class="<?php echo $mainClass; ?>">
      <input type="hidden" name="artifactId" value="<?php echo $_GET['item']; ?>">
      <input type="hidden" name="activeUsr" value="<?php echo $_SESSION['id']; ?>">
      <input type="hidden" name="role" value="<?php echo $_SESSION['role']; ?>">
      <nav class="itemTool">
        <div class="container-fluid">
          <div class="row">
            <div class="col-6">
              <?php if (isset($_SESSION['id'])) { ?>
              <div class="btn-group" role="group">
                <div class="dropdown">
                  <button class="btn btn-adc-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="mdi mdi-plus-thick"></i> add
                  </button>
                  <ul class="dropdown-menu">
                    <li id="addModelBtn"><a href="models.php?item=<?php echo $_GET['item']; ?>" class="dropdown-item">model</a></li>
                    <li><a href="media_add.php?item=<?php echo $_GET['item']; ?>&t=image" class="dropdown-item">image</a></li>
                    <li><a href="media_add.php?item=<?php echo $_GET['item']; ?>&t=document" class="dropdown-item">document</a></li>
                    <li><a href="media_add.php?item=<?php echo $_GET['item']; ?>&t=video" class="dropdown-item">video</a></li>
                  </ul>
                </div>
              </div>
              <div class="btn-group" role="group">
                <div class="dropdown">
                  <button class="btn btn-adc-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="mdi mdi-pencil"></i> edit
                  </button>
                  <ul class="dropdown-menu">
                    <li><a href="artifact_edit.php?item=<?php echo $_GET['item']; ?>" class="dropdown-item">artifact metadata</a></li>
                    <li id="editModelBtn">
                      <a href="" class="dropdown-item">model metadata</a>
                    </li>
                  </ul>
                </div>
              </div>
              <button type="button" name="delete" id="delete" class="btn btn-adc-dark"><i class="mdi mdi-delete-forever"></i> delete</button>
              <?php } ?>
            </div>
            <div class="col-6 text-end">
              <button type="button" name="download" id="download" class="btn btn-adc-dark"><i class="mdi mdi-tray-arrow-down"></i> download</button>
              <button type="button" name="print" id="print" class="btn btn-adc-dark"><i class="mdi mdi-printer"></i> print</button>
            </div>
          </div>
        </div>
      </nav>
      <div id="mainContent">
        <div class="absoluteCol artifactCol artifact-primary" id="artifact">
          <div class="alert" id="status"></div>
          <div class="accordion accordion-flush accordionArtifact" id="accordionArtifact">
            <div class="accordion-item">
              <h2 class="accordion-header" id="main-section">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#mainSection" aria-expanded="false" aria-controls="mainSection">Main data</button>
              </h2>
              <div id="mainSection" class="accordion-collapse collapse" aria-labelledby="main-section" data-bs-parent="#accordionArtifact">
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <span>Name</span>
                      <span id="name"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Category class</span>
                      <span id="category_class"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Category specification</span>
                      <span id="category_specs"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Typology</span>
                      <span id="type"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Material / technique</span>
                      <span id="material">
                        <ol class="list-group list-group-numbered list-group-flush"></ol>
                      </span>
                    </li>
                    <li class="list-group-item">
                      <span>Description</span>
                      <span id="description"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Notes</span>
                      <span id="notes"></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="chronology-data">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#chronologySection">Chronological definition</button>
              </h2>
              <div id="chronologySection" class="accordion-collapse collapse" aria-labelledby="chronology-data" data-bs-parent="#accordionArtifact">
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item txt-adc-dark fw-bold">Specific chronology</li>
                    <li class="list-group-item"><span>start</span><span id="start"></span></li>
                    <li class="list-group-item"><span>end</span><span id="end"></span></li>
                    <li class="list-group-item txt-adc-dark fw-bold">The specific chronology is related to following historical periods</li>
                    <li class="list-group-item"><span>from</span><span id="start_period"></span></li>
                    <li class="list-group-item"><span>to</span><span id="end_period"></span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="conservation-data">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#conservationSection">Conservation info</button>
              </h2>
              <div id="conservationSection" class="accordion-collapse collapse show" aria-labelledby="conservation-data" data-bs-parent="#accordionArtifact">
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <h4 id="storage_name" class="m-1"></h4>
                      <div id="institutionLogo">
                        <img src="" class="img-fluid rounded" alt="">
                      </div>
                      <div id="institutionInfo">
                        <a href="" class="d-block" target="_blank" id="gMapLink" data-bs-toggle="tooltip" data-bs-title="view on Google Maps <br /> [link open a new tab or page]"><i class="mdi mdi-map-marker"></i><span id="storage_address"></span></a>
                        <a href="" class="d-block my-2" target="_blank" id="storage_link" data-bs-toggle="tooltip" data-bs-title="go to official website <br /> [link open a new tab or page]"></a>
                        <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="tooltip" data-bs-title="available veeeery soon!">view institution collection</button>
                      </div>
                    </li>
                    <li class="list-group-item"><span>Inventory</span><span id="inventory"></span></li>
                    <li class="list-group-item"><span>Conservation state</span><span id="conservation_state"></span></li>
                    <li class="list-group-item"><span>Object condition</span><span id="object_condition"></span></li>
                    <li class="list-group-item"><span>Is a museum copy</span><span id="is_museum_copy"></span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-item" id="findplaceAccordionSection">
              <h2 class="accordion-header" id="findplace-data">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#findplaceSection">Find place</button>
              </h2>
              <div id="findplaceSection" class="accordion-collapse collapse" aria-labelledby="findplace-data" data-bs-parent="#accordionArtifact">
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <span>Nation</span>
                      <span id="findplace_nation"></span>
                    </li>
                    <li class="list-group-item">
                      <span>County</span>
                      <span id="findplace_county"></span>
                    </li>
                    <li class="list-group-item">
                      <span>City</span>
                      <span id="findplace_city"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Parish</span>
                      <span id="findplace_parish"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Toponym</span>
                      <span id="findplace_toponym"></span>
                    </li>
                    <li class="list-group-item">
                      <span>Notes</span>
                      <span id="findplace_notes"></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-item" id="measureAccordionSection">
              <h2 class="accordion-header" id="measure-data">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#measureSection">Dimensions</button>
              </h2>
              <div id="measureSection" class="accordion-collapse collapse" aria-labelledby="measure-data" data-bs-parent="#accordionArtifact">
                <div class="accordion-body">
                  <small class="txt-adc-dark">Linear measures are in cm, weight is in gr.</small>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item"><span>Length</span><span id="length"></span></li>
                    <li class="list-group-item"><span>Width</span><span id="width"></span></li>
                    <li class="list-group-item"><span>Depth</span><span id="depth"></span></li>
                    <li class="list-group-item"><span>Diameter</span><span id="diameter"></span></li>
                    <li class="list-group-item"><span>Weight</span><span id="weight"></span></li>
                    <li class="list-group-item">
                      <div>Notes</div>
                      <div id="measures_notes"></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="artifactMetadata-data">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#artifactMetadataSection">Artifact metadata</button>
              </h2>
              <div id="artifactMetadataSection" class="accordion-collapse collapse" aria-labelledby="artifactMetadata-data" data-bs-parent="#accordionArtifact">
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <span>Author</span>
                      <span id="artifact_author"><a href="" data-bs-toggle="tooltip" title="view author profile" class="disabled"></a></span>
                    </li>
                    <li class="list-group-item">
                      <span>Owner</span>
                      <span id="artifact_owner"><a href="" data-bs-toggle="tooltip" title="view owner profile"></a></span>
                    </li>
                    <li class="list-group-item">
                      <span>license</span>
                      <span id="artifact_license"><a href="" target="_blank" data-bs-toggle="tooltip" title="read license summary<br />[link open a new tab]"></a></span>
                    </li>
                    <li class="list-group-item"><span>Create at</span><span id="created_at"></span></li>
                    <li class="list-group-item"><span>Last update</span><span id="last_update"></span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="absoluteCol geographic-primary" id="geographic">
          <div class="divSection mb-5" id="map"></div>
        </div>
        <div class="absoluteCol model-primary" id="model"><?php require('assets/canvas.html'); ?></div> 
        <div class="absoluteCol media-primary border-top p-3" id="media"></div>
        <div class="absoluteCol resource-primary border-top p-3" id="stats"></div>
          <!-- <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom">Stats</h2> -->
                   
      </div>

    </main>
    <?php 
      require("assets/menu.php");
      require("assets/toastDiv.html"); 
      require("assets/js.html"); 
    ?>
    <script type="text/javascript" src="assets/3dhop/spidergl.js"></script>
    <script type="text/javascript" src="assets/3dhop/presenter.js"></script>
    <script type="text/javascript" src="assets/3dhop/nexus.js"></script>
    <script type="text/javascript" src="assets/3dhop/ply.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_turntable_pan.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_pantilt.js"></script>
    <script type="text/javascript" src="assets/3dhop/trackball_sphere.js"></script>
    <script type="text/javascript" src="assets/3dhop/init.js"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="js/3dhop_function.js"></script>
    <script src="js/maps/geo_config.js" charset="utf-8"></script>
    <script src="js/maps/geo_function.js" charset="utf-8"></script>
    <script src="js/artifact_view.js" charset="utf-8"></script>
  </body>
</html>
