<?php require 'init.php'; ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <?php require("assets/meta.php"); ?>
  </head>
  <body>
    <?php require("assets/header.php"); ?>
    <?php require("assets/menu.php"); ?>
    <main class="container">
      <div class="row mb-3">
        <div class="col">
          <h1 class="txt-adc-dark border-bottom">Dynamic Collections is an initiative of DARKLab, Lund University, and the Visual Computing Lab, ISTI-CNR.</h1>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <p>Dynamic Collections is a collaborative initiative spearheaded by the Digital Archaeology Laboratory (DARKLab) at Lund University, in partnership with the Visual Computing Lab at the National Research Council of Italy’s Institute for Information Science and Technologies "Alessandro Faedo" (ISTI), the Lund University Historical Museum, the Department of Archaeology and Ancient History at Lund University, Blekinge Museum, and the Swedish History Museum.</p>
          <p>This project is generously supported by Swedigarch, the Swedish National Infrastructure for Digital Archaeology (https://swedigarch.se/), the Einar Hansen Foundation, and the Thora Ohlsson’s Foundation. We also wish to extend our gratitude to the Lund University Historical Museum (www.historiskamuseet.lu.se) and the Blekinge Museum (www.blekingemuseum.se) for granting access to their collections for this project.</p>
          <p>Our archive aims to create a comprehensive digital repository of 3D models to facilitate the preservation, study, and dissemination of cultural heritage artifacts. The archive serves as an invaluable resource for researchers, educators, and the general public, providing access to detailed 3D representations of archaeological finds and historical objects.</p>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Acknowledgements</h4>
          <p>Special thanks go to our student interns Jake Clarke, Samantha Day, Michael Harris, Filip Johnstone, Margaret Muth, and Hanna Rosenborg, Samantha Day, Nell Esbjörnsson, Yunchen Tan, Andra Tudor for their excellent work and support during the project years 2019–2023.</p>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Project Partners</h4>
          <ul>
            <li><a href="https://www.darklab.lu.se/" target="_blank" title="web site">Lund University Digital Archaeology Laboratory - DARKLab</a></li>
            <li><a href="http://vcg.isti.cnr.it/" target="_blank" title="web site">Visual Computing Lab, National Research Council of Italy, Institute for Information Science and Technologies "Alessandro Faedo" - ISTI</a></li>
            <li><a href="https://www.historiskamuseet.lu.se/english" target="_blank" title="web site">Lund University Historical Museum</a></li>
            <li><a href="https://www.ark.lu.se/" target="_blank" title="web site">Department of Archaeology and Ancient History, Lund University</a></li>
            <li><a href="https://blekingemuseum.se" target="_blank" title="web site">Blekinge Museum</a></li>
            <li><a href="https://historiska.se/home/" target="_blank" title="web site">The Swedish History Museum</a></li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Project Participants</h4>
          <ul>
            <li>Fredrik Ekengren, Lund University</li>
            <li>Nicolò Dell’Unto, Lund University</li>
            <li>Marco Callieri, CNR: National Research Council of Italy</li>
            <li>Paola Derudas, Lund University</li>
            <li>Danilo Marco Campanaro, Lund University</li>
            <li>Giuseppe Naponiello, Lund University</li>
            <li>Åsa Berggren, Lund University</li>
            <li>Elna Arvidsson</li>
            <li>Rebecca Ringdahl</li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Project Coordination</h4>
          <ul>
            <li>Nicolò Dell'Unto (PI)</li>
            <li>Fredrik Ekengren (Co-PI)</li>
            <li>Marco Callieri (Co-PI)</li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>System Development</h4>
          <ul>
            <li>Marco Callieri</li>
            <li>Giuseppe Naponiello</li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Database and mapping </h4>
          <ul>
            <li>Marco Callieri</li>
            <li>Paola Derudas</li>
            <li>Giuseppe Naponiello</li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Data Acquisition and Post Processing</h4>
          <ul>
            <li>Danilo Marco Campanaro</li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Web Contents</h4>
          <ul>
            <li>Marco Callieri</li>
            <li>Danilo Marco Campanaro</li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Copyright and License Information</h4>
          <p>Online System: Copyright (C) 2020-<?php echo date("Y"); ?> - Lund University, ISTI-CNR. All rights reserved.</p>
          <!-- <p>The source code of the Dynamic Collections platform (legacy) is available for download and free use from January 2024. You can access it using this link:</p>
          <a href="https://github.com/LundDarkLab/adc"><span class="mdi mdi-github"></span> https://github.com/LundDarkLab/adc</a> -->
          <p>All copyright information can be found on the artifact page of each object.<br>If the object is available for download, follow the instructions provided on the repository where the model and relative metadata are stored.<br>Models made available for download are typically under CreativeCommons licenses. Note that different datasets may follow different versions of the CC BY license, so always check the specific license assigned to the dataset.</p>
          <h4 class='txt-adc-dark fw-bold border-bottom'>License schema</h4>
          <table class="table text-center">
            <thead>
              <tr>
                <th>Text, images and 3d model files</th>
                <th>Database structure</th>
                <th>Platform Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="py-3">
                    <img src="img/ico/cc.png" height="40px" class="d-inline" alt="">
                    <img src="img/ico/cc-by.png" height="40px" class="d-inline" alt="">
                    <img src="img/ico/cc-nc.png" height="40px" class="d-inline" alt="">
                    <img src="img/ico/cc-sa.png" height="40px" class="d-inline" alt="">
                  </div>
                  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" title="cc-by-nc-sa 4.0 deed">Attribution-NonCommercial-ShareAlike 4.0 International</a>
                </td>
                <td>
                  <div class="py-3"><img src="img/ico/lg-okfn.svg" height="40px" class="d-inline" alt=""></div>
                  <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" title="ODbL">Open Data Commons Open Database License (ODbL)</a>
                </td>
                <td>
                  <div class="py-3"><img src="img/ico/agplv3.png" height="40px" class="d-inline" alt=""></div>
                  <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank" title="Affero GPL 3.0 deed">GNU Affero General Public License</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Using the Data Sets Available on Dynamic Collections</h4>
          <p>The data sets available through the Dynamic Collections platform are categorized into three main types. Please be aware that each type may be subject to different copyright regulations:</p>
          <ul>
            <li>Metadata Concerning the Physical Object</li>
            <li>Metadata Concerning the Digital Object (Paradata)</li>
            <li>3D Model and Relative Metadata</li>
          </ul>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Instructions and Guidelines</h4>
          <p>Instructions are included in the zip file, on the page where the models are made available, and on the artifact web page of the Dynamic Collections.</p>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <h4 class='txt-adc-dark fw-bold border-bottom'>Creating and Using Screenshots</h4>
          <p>If you create screenshots using the screenshot function or capture images of the platform, we would appreciate it if you could include a link to the Dynamic Collections main page in the caption.</p>
          <p>Example caption: "Image produced using the Dynamic Collections web page."</p>
          <p>Thank you for adhering to these guidelines and for helping us maintain the integrity and usability of our data.</p>
        </div>
      </div>
    </main>
    <?php require("assets/js.html"); ?>
  </body>
</html>
