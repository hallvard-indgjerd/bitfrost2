<?php
namespace Adc;
class File {
  public $fileAllowed = array(
    'nxz' => 'application/octet-stream', 
    'png' => 'image/png',
    'jpe' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'jpg' => 'image/jpeg', 
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'odt' => 'application/vnd.oasis.opendocument.text',
    'ods' => 'application/vnd.oasis.opendocument.spreadsheet'
  );
  public $maxSize = 536870912; //512MB

  public function __construct() {}

  public function upload($file, $folder, $name){
    try {
      $this->checkError($file['error']);
      $this->checkType($file['name'], $file['type']);
      $this->checkSize($file['error']);
      $this->moveFile($file, $folder, $name);
      return true;
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  protected function checkError($error){
    if($error == 1){
      throw new \Exception("Sorry but something went wrong during the loading process, please try again or contact the system administrator.", 1);
    }
    return true;
  }

  protected function checkType($fileExt, $fileMime){
    $ext = explode('.', $fileExt);
    $ext = array_pop($ext);
    $ext = mb_strtolower(strval($ext));
    if(!array_key_exists($ext,$this->fileAllowed)){
      throw new \Exception("Sorry but you are trying to upload a file with an extension that is not allowed", 1);
    }
    if($fileMime !== $this->fileAllowed[$ext]){
      throw new \Exception("Sorry but you are trying to upload an invalid file type", 1);
    }
    return true;
  }

  protected function checkSize($size){
    if($size > $this->maxSize){
      throw new \Exception("Sorry but the file exceeds the maximum size allowed", 1);
    }
    return true;
  }

  protected function moveFile($file, $folder, $name){
    $fileLoc = $_SERVER['DOCUMENT_ROOT']."/adc/".$folder.$name;
    if(!move_uploaded_file($file["tmp_name"], $fileLoc)){ 
      throw new \Exception("Sorry but there was an error while uploading the file to the server, please try again or contact the system administrator", 1); 
    }
    chmod($fileLoc, 0666);
    return true;
  }
}

?>