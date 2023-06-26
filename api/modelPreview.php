<?php
$fileName = $_FILES["nxz"]["name"];
$fileTmpLoc = $_FILES["nxz"]["tmp_name"];
$fileLoc = $_SERVER['DOCUMENT_ROOT']."/adc/archive/models/preview/".$fileName;
$fileType = $_FILES["nxz"]["type"];
$fileSize = $_FILES["nxz"]["size"];
$fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
$fileErrorMsg = $_FILES["nxz"]["error"];//0 false, 1 true
if (!$fileTmpLoc) {
  echo "Please browse for a file before clicking the upload button.";
  exit();
}

if ($fileExt !== 'nxz') {
  echo "Sorry but you can upload only nxz files. You are trying to upload a ".$fileExt." file type";
  exit();
}
if ($fileType !== 'application/octet-stream') {
  echo "Sorry but you can upload only nxz files. You are trying to upload a ".$fileType." file type";
  exit();
}
if(move_uploaded_file($fileTmpLoc, $fileLoc)){
  echo $fileName." upload is complete";
} else {
  echo "move_uploaded_file function failed, view server log for more details";
}
?>
