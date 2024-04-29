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
    $this->imageDir = $_SERVER['DOCUMENT_ROOT']."/prototype/archive/image/";
    $this->documentDir = $_SERVER['DOCUMENT_ROOT']."/prototype/archive/document/";
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
      // if(count($file)>0){$this->deleteFile($folder.$name);}
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function getMedia(int $id){
    return $this->simple("select * from files where artifact = ".$id.";");
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

  public function deleteFile(string $fileName){
    if(!unlink($fileName)){ throw new \Exception("Error: file has not been deleted", 1); }
    return true;
  }
}

?>