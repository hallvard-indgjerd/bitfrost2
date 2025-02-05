<?php
namespace Adc;
use Ramsey\Uuid\Uuid;
class File extends Conn{
  public $uuid;
  public $imageDir;
  public $documentDir;
  public $name;

  public $imageAllowed = array(
    'png' => 'image/png',
    'jpe' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'jpg' => 'image/jpeg', 
  );
  public $documentAllowed = array(
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'odt' => 'application/vnd.oasis.opendocument.text',
    'ods' => 'application/vnd.oasis.opendocument.spreadsheet'
  );
  public $modelAllowed = array(
    'nxz' => 'application/octet-stream', 
    'ply' => 'application/octet-stream', 
    'obj' => 'application/octet-stream', 
  );
  public $maxSize = 536870912; //512MB

  public function __construct() {
    $this->uuid = Uuid::uuid4();
    $currentDir = __DIR__;
    if (strpos($currentDir, 'prototype_dev') !== false) {
      $rootFolder = 'prototype_dev';
    } else {
      $rootFolder = 'plus';
    }
    $this->imageDir = $_SERVER['DOCUMENT_ROOT']."/".$rootFolder."/archive/image/";
    $this->documentDir = $_SERVER['DOCUMENT_ROOT']."/".$rootFolder."/archive/document/";
  }

  public function addMedia($data, $file=null){
    try {
      if($file && $file !== null){
        $folder = $data['type'] == 'image' ? $this->imageDir : $this->documentDir;
        $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $name = $this->uuid.".".$ext;
        $data['path'] = $name;
        $this->upload($file, $folder, $name, $data['type']);
      }
      $sql = $this->buildInsert("files", $data);
      $this->prepared($sql, $data);
      return ["res"=> 1, "output"=>'Ok, the media has been added successfully'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function editImage(array $data){
    try {
      $sql = $this->buildUpdate("files", ['id'=>$data['id']], $data);
      $this->prepared($sql, $data);
      return ["error"=> 0, "output"=>'Ok, the media has been added successfully'];
    } catch (\Exception $e) {
      return ["error"=>1, "output"=>$e->getMessage()];
    }
  }

  public function getMedia(int $id){
    return $this->simple("select f.id file, f.type, f.path, f.url, f.text, f.downloadable, l.id license_id, l.license, l.acronym, l.link, l.file deed from files f left join license l on f.license = l.id where f.artifact = ".$id.";");
  }

  public function upload($file, $folder, $name, $type){
    $fileAllowed = $type == 'image' ? $this->imageAllowed : $this->documentAllowed;
    $this->checkError($file['error']);
    $this->checkType($file['name'], $file['type'],$fileAllowed);
    $this->checkSize($file['error']);
    $this->moveFile($file, $folder, $name);
    return true;
  }

  protected function checkError($error){
    if($error == 1){
      throw new \Exception("Sorry but something went wrong during the loading process, please try again or contact the system administrator.", 1);
    }
    return true;
  }

  protected function checkType($fileExt, $fileMime, array $fileAllowed){
    $ext = explode('.', $fileExt);
    $ext = array_pop($ext);
    $ext = mb_strtolower(strval($ext));
    if(!array_key_exists($ext,$fileAllowed)){
      throw new \Exception("Sorry but you are trying to upload a file with an extension that is not allowed", 1);
    }
    if($fileMime !== $fileAllowed[$ext]){
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
    $fileLoc = $folder.$name;
    if(!move_uploaded_file($file["tmp_name"], $fileLoc)){ 
      throw new \Exception("Sorry but there was an error while uploading the file to the server, please try again or contact the system administrator", 1); 
    }
    chmod($fileLoc, 0666);
    return true;
  }

  public function deleteImg(array $dati){
    try {
      $file = $this->imageDir.$dati['img'];
      if(!unlink($file)){ throw new \Exception("Error: file has not been deleted", 1); }
      $sql = "delete from files where id = :id;";
      $this->prepared($sql,["id"=>$dati['id']]);
      return ["error"=> 0, "output"=>'Ok, the image has been successfully removed.'];
    } catch (\Throwable $th) {
      $this->pdo()->rollBack();
      return ["error"=>1, "output"=>$th->getMessage()];
    }
  }

  public function deleteFile(string $path){
    try {
      if(!unlink($path)){ throw new \Exception("Error: file has not been deleted", 1); }
      return ["error"=> 0, "output"=>'Ok, the image has been successfully removed.'];
    } catch (\Throwable $th) {
      return ["error"=>1, "output"=>$th->getMessage()];
    }
  }
}

?>