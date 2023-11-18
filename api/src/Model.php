<?php
namespace Adc;
session_start();
class Model extends Conn{
  function __construct(){}

  public function addModel($data, $file){
    try {
      // $this->handleFile($file['nxz'], 'nxz');
      $this->handleFile($file['thumb'], 'png');
      // $this->handleMetadata($data);
      return $file;
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  private function handleFile($file, $ext){
    $folder = $ext == 'nxz' ? 'models/' : 'thumb/';
    $type = $ext == 'nxz' ? 'application/octet-stream' : 'image/png';
    $fileName = $file["name"];
    $fileTmpLoc = $file["tmp_name"];
    $fileLoc = $_SERVER['DOCUMENT_ROOT']."/adc/archive/".$folder.$fileName;
    $fileType = $file["type"];
    $fileSize = $file["size"];
    $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
    $fileErrorMsg = $file["error"];//0 false, 1 true
    if (!$fileTmpLoc) { throw new \Exception("Please browse for a file before clicking the upload button.", 1); }
    if ($fileExt !== $ext || $fileType !== $type) { throw new \Exception("Sorry but you can upload only ".$ext." files. You are trying to upload a ".$fileExt." file type", 1); }
    if(!move_uploaded_file($fileTmpLoc, $fileLoc)){ throw new \Exception("move_uploaded_file function failed, view server log for more details", 1); }
    // echo $fileName." upload is complete";
    chmod($fileLoc, 0666);

    return true;
  }

  public function buildGallery(string $sortBy, $filterArr= array()){
    $filter = empty($filterArr) ? "" : " where ". join(" and ", $filterArr);
    $sql = "select   artifact.id, 
    artifact.name, 
    coalesce(artifact.description, 'no description available','') description, 
    class.id as category_id, 
    class.value as category, 
    material.id as material_id, 
    coalesce(material.value, null, 'not defined') as material, 
    artifact.start, 
    artifact.end, 
    obj.object, 
    obj.thumbnail
  from artifact
  inner join list_category_class class on artifact.category_class = class.id
  inner join artifact_material_technique amt on amt.artifact = artifact.id
  inner join artifact_model am on artifact.id = am.artifact
  inner join model_object obj on obj.model = am.model
  left join list_material_specs material on amt.material = material.id ".$filter." order by ".$sortBy.";";
    return $this->simple($sql);
  }

  public function getModel(int $id){
    $out['model'] = $this->simple("select * from model where id = ".$id.";")[0];
    $out['model_biblio'] = $this->simple("select * from model_biblio where model = ".$id.";")[0];
    $out['model_object'] = $this->simple("select * from model_query_view where model = ".$id.";")[0];
    $out['model_view'] = $this->simple("select * from model_view where model = ".$id." and default_view = true;")[0];
    $out['model_param'] = $this->simple("select * from model_param where object = ".$out['model_object']['id'].";")[0];
    // $out['model_metadata'] = $this->getModelMetadata($id);

    return $out;
  }

  // private function getModelMetadata(int $id){
  //   $sql = "select auth.id auth_id, concat(auth.first_name,' ',auth.last_name) auth, owner.id owner_id, owner.name owner, license.license, license.acronym, license.link licenseLink, item.create_at, item.updated_at from model_metadata item inner join user on item.author = user.id inner join person auth on user.person = auth.id inner join institution owner on item.owner = owner.id inner join license on item.license = license.id where item.model = ".$id.";";
  //   return $this->simple($sql)[0];
  // }

  public function getModels(array $search){
    $filter = [];
    if($search['status'] > 0){
      array_push($filter, "status = ".$search['status']);
    }else {
      array_push($filter, "status > ".$search['status']);
    }
    if($_SESSION['role'] > 4){array_push($filter, "author = ".$_SESSION['id']);}
    if(count($filter) > 0 ){ $filter = "where ".join(" and ", $filter);}

    $sql = "select m.id, m.nxz, m.thumb_256 thumb, u.id author_id, concat (p.first_name, ' ', p.last_name) name, m.description,  meta.updated_at from model m inner join model_metadata meta on meta.model= m.id inner join user u on meta.author = u.id inner join person p on u.person = p.id ".$filter." order by meta.updated_at desc;";

    return $this->simple($sql);
  }

  public function saveModelParam(array $dati){
    try {
      $sql = $this->buildInsert('model_view', $dati);
      $this->prepared($sql, $dati);
      return ["res"=>1, "msg"=>'ok, parameters saved'];
    } catch (\Exception $e) {
      return ["res"=>0, "msg"=>$e->getMessage()];
    }
  }

  public function updateModelParam(array $dati){
    try {
      $filter = ["model"=>$dati['model']];
      unset($dati['model']);
      $sql = $this->buildUpdate("model_view", $filter, $dati);
      $this->prepared($sql, $dati);
      return ["res"=>1, "msg"=>'ok, parameters updated'];
    } catch (\Exception $e) {
      return ["res"=>0, "msg"=>$e->getMessage()];
    }
  }
}
?>
