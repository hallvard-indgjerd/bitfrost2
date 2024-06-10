<?php
// $data_url = $_POST['thumb'];

// list($type, $data) = explode(';', $data_url);
// list(, $data)      = explode(',', $data);
// $data = base64_decode($data);
// $fileLoc = $_SERVER['DOCUMENT_ROOT']."/adc/archive/models/preview/".$_POST['name'].'.jpg';
// $file = file_put_contents($fileLoc, $data);
// if(file_put_contents($fileLoc, $data)){
//   chmod($fileLoc, 0666);
//   $out = $fileLoc." upload is complete";
// } else {
//   $out = "move_uploaded_file function failed, view server log for more details";
// }
// echo json_encode($out);
$fileName = $_FILES["thumb"]["name"];
$fileTmpLoc = $_FILES["thumb"]["tmp_name"];
$fileLoc = $_SERVER['DOCUMENT_ROOT']."/adc/archive/models/preview/".$fileName;
$fileType = $_FILES["thumb"]["type"];
$fileSize = $_FILES["thumb"]["size"];
$fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
$fileErrorMsg = $_FILES["thumb"]["error"];//0 false, 1 true
if (!$fileTmpLoc) {
  echo "Please browse for a file before clicking the upload button.";
  exit();
}

if ($fileExt !== 'png') {
  echo "Sorry but you can upload only png files. You are trying to upload a ".$fileExt." file type";
  exit();
}
// if ($fileType !== 'image/png') {
//   echo "Sorry but you can upload only png files. You are trying to upload a ".$fileType." file type";
//   exit();
// }
if(move_uploaded_file($fileTmpLoc, $fileLoc)){
  chmod($fileLoc, 0666);
  echo $fileName." upload is complete";
} else {
  echo "move_uploaded_file function failed, view server log for more details";
}
?>
