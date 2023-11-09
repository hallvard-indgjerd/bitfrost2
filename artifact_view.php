<?php
  require 'init.php';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" media="screen"/>
    <link rel="stylesheet" href="css/artifact_view.css">
  </head>
  <body>
    <?php require("assets/header.php"); ?>
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
                    <li><a href="#" class="dropdown-item">3d model</a></li>
                    <li><a href="#" class="dropdown-item">image and photo</a></li>
                    <li><a href="#" class="dropdown-item">document</a></li>
                    <li><a href="#" class="dropdown-item">reference</a></li>
                  </ul>
                </div>
              </div>
              <div class="btn-group" role="group">
                <div class="dropdown">
                  <button class="btn btn-adc-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="mdi mdi-pencil"></i> edit
                  </button>
                  <ul class="dropdown-menu">
                    <li><a href="#" class="dropdown-item">artifact metadata</a></li>
                    <li><a href="#" class="dropdown-item">model metadata</a></li>
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
      <div class="container-fluid" id="wrapData">
        <div class="row">
          <div class="col-md-4">
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom">Artifact</h2>
            <div class="alert" id="status"></div>
            <div class="divSection mb-5">
              <div class="accordion accordion-flush" id="accordionArtifact">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="main-section">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#mainSection" aria-expanded="true" aria-controls="mainSection">Main data</button>
                  </h2>
                  <div id="mainSection" class="accordion-collapse collapse show" aria-labelledby="main-section">
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
                          <div>Material / technique</div>
                          <div id="material">
                            <ol class="list-group list-group-numbered list-group-flush"></ol>
                          </div>
                        </li>
                        <li class="list-group-item">
                          <div>Description</div>
                          <div id="description"></div>
                        </li>
                        <li class="list-group-item">
                          <div>Notes</div>
                          <div id="notes"></div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="chronology-data">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#chronologySection">Chronological definition</button>
                  </h2>
                  <div id="chronologySection" class="accordion-collapse collapse" aria-labelledby="chronology-data">
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
                  <div id="conservationSection" class="accordion-collapse collapse" aria-labelledby="conservation-data">
                    <div class="accordion-body">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                          <div>Storage place</div>
                          <p id="storage_name" class="m-1"></p>
                          <a href="" class="d-block" target="_blank" id="gMapLink" data-bs-toggle="tooltip" data-bs-title="view on Google Maps <br /> [link open a new tab or page]"><i class="mdi mdi-map-marker"></i><span id="storage_address"></span></a>
                          <a href="" class="d-block" target="_blank" id="storage_link" data-bs-toggle="tooltip" data-bs-title="go to official website <br /> [link open a new tab or page]"></a>
                        </li>
                        <li class="list-group-item"><span>Inventory</span><span id="inventory"></span></li>
                        <li class="list-group-item"><span>Conservation state</span><span id="conservation_state"></span></li>
                        <li class="list-group-item"><span>Object condition</span><span id="object_condition"></span></li>
                        <li class="list-group-item"><span>Is a museum copy</span><span id="is_museum_copy"></span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="findplace-data">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#findplaceSection">Find place</button>
                  </h2>
                  <div id="findplaceSection" class="accordion-collapse collapse" aria-labelledby="findplace-data">
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
                          <span id="findplace_city">Not defined</span>
                        </li>
                        <li class="list-group-item">
                          <span>Parish</span>
                          <span id="findplace_parish">Not defined</span>
                        </li>
                        <li class="list-group-item">
                          <span>Toponym</span>
                          <span id="findplace_toponym">Not defined</span>
                        </li>
                        <li class="list-group-item">
                          <div>Notes</div>
                          <div id="findplace_notes">Not defined</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="measure-data">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#measureSection">Dimensions</button>
                  </h2>
                  <div id="measureSection" class="accordion-collapse collapse" aria-labelledby="measure-data">
                    <div class="accordion-body">
                      <small class="txt-adc-dark">Linear measures are in cm, weight is in gr.</small>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item"><span>Length</span><span id="length">measure not defined</span></li>
                        <li class="list-group-item"><span>Width</span><span id="width">measure not defined</span></li>
                        <li class="list-group-item"><span>Depth</span><span id="depth">measure not defined</span></li>
                        <li class="list-group-item"><span>Diameter</span><span id="diameter">measure not defined</span></li>
                        <li class="list-group-item"><span>Weight</span><span id="weight">measure not defined</span></li>
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
                  <div id="artifactMetadataSection" class="accordion-collapse collapse" aria-labelledby="artifactMetadata-data">
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
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom">Model informations</h2>
            <div class="divSection mb-5">
              <p class="fw-bold h5 my-3" id="model-description"></p>
              <div class="accordion accordion-flush" id="accordionModel">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="model-metadata-btn">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#model-metadata" aria-expanded="true" aria-controls="model-metadata">Model metadata</button>
                  </h2>
                  <div id="model-metadata" class="accordion-collapse collapse" aria-labelledby="model-metadata-btn">
                    <div class="accordion-body">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item"><span>Author</span><span id="model-auth"></span></li>
                        <li class="list-group-item"><span>Owner</span><span id="model-owner"></span></li>
                        <li class="list-group-item"><span>license</span><span id="model-license"></span></li>
                        <li class="list-group-item"><span>Create at</span><span id="model-create_at"></span></li>
                       <li class="list-group-item"><span>Last update</span><span id="model-updated_at"></span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="model-param-btn">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#model-param" aria-expanded="true" aria-controls="model-param">Model parameters</button>
                  </h2>
                  <div id="model-param" class="accordion-collapse collapse" aria-labelledby="model-param-btn">
                    <div class="accordion-body">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item"><span>Acquisition method</span><span id="model-acquisition_method"></span></li>
                        <li class="list-group-item"><span>Software</span><span id="model-software"></span></li>
                        <li class="list-group-item"><span>Scans</span><span id="model-scans"></span></li>
                        <li class="list-group-item"><span>Textures</span><span id="model-textures"></span></li>
                        <li class="list-group-item"><span>Pictures number</span><span id="model-pictures"></span></li>
                        <li class="list-group-item"><span>Points</span><span id="model-points"></span></li>
                        <li class="list-group-item"><span>Polygons</span><span id="model-polygons"></span></li>
                        <li class="list-group-item"><span>Measure unit</span><span id="model-measure_unit"></span></li>
                        <li class="list-group-item"><span>Encumbrance</span><span id="model-encumbrance"></span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom">3d Object</h2>
            <div id="modelWrap">
              <div id="3dhop" class="tdhop">
                <canvas id="draw-canvas"></canvas>
                <div id="wrapViewSpot" class="modelTools rounded">
                  <div class="bg-light">
                    <button type="button" class="btn btn-sm btn-adc-dark w-100" name="toggleViewSpot" data-bs-toggle="collapse" data-bs-target="#viewSpotDiv">views & spots <span class="mdi mdi-chevron-down float-end"></span></button>
                  </div>
                  <div id="viewSpotDiv" class="collapse mt-3">
                    <div id="viewsDiv" class="mb-4">
                      <div id="wrapViews">No views</div>
                      <div class="mt-3">
                        <button type="button" name="addViewBtn" class="btn btn-sm btn-dark">add view</button>
                        <button type="button" name="saveViewBtn" class="btn btn-sm btn-success invisible">save views</button>
                      </div>
                    </div>
                    <div id="spotsDiv">
                      <div id="wrapSpots">No spots</div>
                      <div>
                        <button type="button" name="addSpotBtn" class="btn btn-sm btn-dark">add spot</button>
                        <button type="button" name="saveSpotBtn" class="btn btn-sm btn-success invisible">save spots</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="modelToolsH" class="rounded modelTools">
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-dark" data-bs-toggle="tooltip" title="restore initial view" data-action="home">
                      <span class="mdi mdi-home"></span>
                    </button>
                    <button type="button" class="btn btn-dark" data-bs-toggle="tooltip" title="zoom in" data-action="zoomin">
                      <span class="mdi mdi-magnify-plus"></span>
                    </button>
                    <button type="button" class="btn btn-dark" data-bs-toggle="tooltip" title="zoom out" data-action="zoomout">
                      <span class="mdi mdi-magnify-minus"></span>
                    </button>
                    <button type="button" class="btn btn-dark" data-bs-toggle="tooltip" title="toggle fullscreen mode" name="fullscreenToggle" data-action="fullscreen_out">
                      <span class="mdi mdi-fullscreen"></span>
                    </button>
                    <button type="button" class="btn btn-dark" data-bs-toggle="tooltip" title="download a screenshot of the current view in png format" name="screenshot" data-action="screenshot">
                      <span class="mdi mdi-monitor-screenshot"></span>
                    </button>
                  </div>
                </div>
                <div id="modelToolsV" class="rounded modelTools">
                  <div class="d-grid gap-1 mb-4">
                    <div class="alert bg-adc-dark p-1 m-0 text-center">Set parameters</div>
                    <div class="dropdown toolBtn" id="viewsideListValue" title="set view">
                      <button class="btn btn-sm btn-dark dropdown-toggle w-100" type="button" id="dropdownViewList" data-bs-toggle="dropdown" aria-expanded="false">set view</button>
                      <ul class="dropdown-menu">
                      <li><button class="dropdown-item" name="viewside" value="0,90,0.0,0.0,0.0,1.3">top</button></li>
                      <li><button class="dropdown-item" name="viewside" value="0,-90,0.0,0.0,0.0,1.3">bottom</button></li>
                      <li><button class="dropdown-item" name="viewside" value="0,0,0.0,0.0,0.0,1.3">front</button></li>
                      <li><button class="dropdown-item" name="viewside" value="-90,0,0.0,0.0,0.0,1.3">left</button></li>
                      <li><button class="dropdown-item" name="viewside" value="90,0,0.0,0.0,0.0,1.3">right</button></li>
                      <li><button class="dropdown-item" name="viewside" value="180,0,0.0,0.0,0.0,1.3">back</button></li>
                      </ul>
                    </div>

                    <div class="dropdown toolBtn" id="gridListValue" title="chose grid type or set a box">
                      <button class=" btn btn-sm btn-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" id="dropdownGridList" aria-expanded="false">base grid</button>
                      <ul class="dropdown-menu">
                      <li><button class="dropdown-item" name="changeGrid" value="gridOff">grid off</button></li>
                      <li><button class="dropdown-item active" name="changeGrid" value="gridBase">base grid</button></li>
                      <li><button class="dropdown-item" name="changeGrid" value="gridBox">box</button></li>
                      <li><button class="dropdown-item" name="changeGrid" value="gridBB">fixed grid</button></li>
                      </ul>
                    </div>

                    <input type="checkbox" class="btn-check" name="ortho" id="ortho" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" for="ortho" title="switch orthogonal view">ortho</label>

                    <input type="checkbox" class="btn-check" name="xyzAxes" id="i_axes" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" for="i_axes" title="view or hide XYZ axes">XYZ axes</label>
                    
                    <input type="checkbox" class="btn-check measureTool" name="light" id="light" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" title="enable light tool" for="light">light</label>

                    <input type="checkbox" class="btn-check" name="texture" id="i_solidColor" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" for="i_solidColor" title="view mesh with texture or in plain color">texture</label>

                    <input type="checkbox" class="btn-check" name="solid" id="i_transparency" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" for="i_transparency" title="view transparent or solid model">solid</label>

                    <input type="checkbox" class="btn-check" name="lighting" id="i_useLighting" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" for="i_useLighting" title="lighting or unshaded object">lighting</label>

                    <input type="checkbox" class="btn-check" name="specular" id="i_useSpecular" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" for="i_useSpecular" title="light diffuse or specular">diffuse</label>

                    <button type="button" name="saveModelParam" class="toolBtn btn btn-sm btn-success invisible" title="Save parameters in the database, they will be used the next time the model is loaded">update default parameters</button>
                  </div>

                  <div class="d-grid gap-1" role="group" id="measureTool">
                    <div class="alert bg-adc-dark p-1 m-0 text-center">Toolbar</div>
                    <input type="checkbox" class="btn-check measureTool" id="measure" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" title="enable measure tool" for="measure">measure</label>

                    <input type="checkbox" class="btn-check measureTool" id="pick" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" title="enable pick tool" for="pick">pick</label>

                    <input type="checkbox" class="btn-check measureTool" id="angle" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" title="enable angle tool" for="angle">angle</label>

                    <input type="checkbox" class="btn-check measureTool" id="section" autocomplete="off">
                    <label class="toolBtn btn btn-sm btn-outline-dark" title="enable section tool" for="section">section</label>
                  </div>
                </div>

                <div id="panel_instructions" class="rounded invisible"></div>

                <div id="measure-box" class="rounded invisible text-center">
                  <p id="measure-box-title" class="m-0 border-bottom border-secondary"></p>
                  <h6 id="measure-output" class="m-0"></h6>
                </div>

                <div id="sections-box" class="container-fluid text-bg-dark rounded invisible">
                  <div class="row">
                    <div class="col-4">
                      <small data-bs-toggle="tooltip" title="Enable or disable X, Y or Z Axis Section">
                        <i class="mdi mdi-information-variant-circle"></i> Plane
                      </small>
                    </div>
                    <div class="col-5">
                      <small data-bs-toggle="tooltip" title="Move Axis Section Position">
                        <i class="mdi mdi-information-variant-circle"></i> Position
                      </small>
                    </div>
                    <div class="col-3 text-end">
                      <small data-bs-toggle="tooltip" title="Flip Axis Section Direction">
                        <i class="mdi mdi-information-variant-circle"></i> Flip
                      </small>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <img id="xplane" class="img-fluid togglePlaneIco" src="img/ico/sectionX_off.png">
                    </div>
                    <div class="col-6">
                      <input type="range" name="xplaneSlider" min="0" max="1" step="0.01" value="0.5" id="xplaneSlider">
                    </div>
                    <div class="col-3">
                      <div class="form-check form-check-reverse form-control-sm m-0">
                        <input class="form-check-input" type="checkbox" id="xplaneFlip" name="planeFlipCheckbox">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <img id="yplane" class="img-fluid togglePlaneIco" src="img/ico/sectionY_off.png">
                    </div>
                    <div class="col-6">
                      <input type="range" name="yplaneSlider" min="0" max="1" step="0.01" value="0.5" id="yplaneSlider">
                    </div>
                    <div class="col-3">
                      <div class="form-check form-check-reverse form-control-sm m-0">
                        <input class="form-check-input" type="checkbox" id="yplaneFlip" name="planeFlipCheckbox">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <img id="zplane" class="img-fluid togglePlaneIco" src="img/ico/sectionZ_off.png">
                    </div>
                    <div class="col-6">
                      <input type="range" name="zplaneSlider" min="0" max="1" step="0.01" value="0.5" id="zplaneSlider">
                    </div>
                    <div class="col-3">
                      <div class="form-check form-check-reverse form-control-sm m-0">
                        <input class="form-check-input" type="checkbox" id="zplaneFlip" name="planeFlipCheckbox">
                      </div>
                    </div>
                  </div>
                  <div class="row invisible" id="planesEdgesDiv">
                    <div class="col-6">
                      <div class="form-check form-check-reverse form-control-sm m-0" title="Toggle model section planes view" data-bs-toggle="tooltip">
                        <input class="form-check-input" type="checkbox" id="showPlane" checked>
                        <label class="form-check-label" for="reverseCheck1">Show planes</label>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="form-check form-check-reverse form-control-sm m-0" title="Toggle model section edges view" data-bs-toggle="tooltip">
                        <input class="form-check-input" type="checkbox" id="showBorder" checked>
                        <label class="form-check-label" for="reverseCheck1">Show edges</label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom">Geographic information</h2>
            <div class="divSection mb-5" id="map">
              <!-- <div id="alertMapWrap">
                <div class="alert alert-danger">Coordinaes not saved</div>
              </div> -->
            </div>
            <h2 class="titleSection d-block txt-adc-dark fw-bold border-bottom">Media gallery</h2>
            <div class="divSection mb-5"></div>
          </div>
        </div>
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
    <script src="js/3dhop_function.js"></script>
    <script src="js/geoConfig.js" charset="utf-8"></script>
    <script src="js/artifact_view.js" charset="utf-8"></script>
  </body>
</html>
