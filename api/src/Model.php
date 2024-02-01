<?php
namespace Adc;
session_start();
use Ramsey\Uuid\Uuid;

class Model extends Conn{
  public $uuid;
  public $modelDir;
  public $modelPreview;
  public $thumbDir;
  function __construct(){
    $this->uuid = Uuid::uuid4();
    $this->modelDir = $_SERVER['DOCUMENT_ROOT']."/prototype/archive/models/";
    $this->modelPreview = $_SERVER['DOCUMENT_ROOT']."/prototype/archive/models/preview/";
    $this->thumbDir = $_SERVER['DOCUMENT_ROOT']."/prototype/archive/thumb/";
  }

  public function saveModel($data, $files){
    try {
      $this->pdo()->beginTransaction();
      // prepare & save model data
      $thumbExt = pathinfo($files['thumb']["name"], PATHINFO_EXTENSION);
      $modelArray = array(
        'name'=>$data['name'],
        'description'=>$data['description'], 
        'thumbnail'=>$this->uuid.".".$thumbExt,
        'updated_by' => $data['author']
      );
      if(isset($data['note'])){$modelArray['note']=$data['note'];}
      $sql = $this->buildInsert("model", $modelArray);
      $this->prepared($sql, $modelArray);
      $data['model'] = $this->pdo()->lastInsertId();      

      // prepare & save model_object data
      $objectData = $this->buildObjectData($data, $files);
      $sqlObject = $this->buildInsert("model_object", $objectData);
      $this->prepared($sqlObject, $objectData);
      $data['object'] = $this->pdo()->lastInsertId();

      //prepare & save model_view data
      $viewData = $this->buildObjectView($data);
      $sqlView = $this->buildInsert('model_view', $viewData);
      $this->prepared($sqlView, $viewData);
      
      //prepare & save object_param
      $paramData = $this->buildObjectParam($data);
      $sqlParam = $this->buildInsert('model_param', $paramData);
      $this->prepared($sqlParam, $paramData);

      $this->pdo()->commit();

      //upload, move, handle image and 3d file
      $this->handle3dFile($files['nxz']);
      $this->handleImg($files['thumb']);

      return ["res"=> 1, "output"=>'Ok, the model has been successfully created.', "id"=>$data['model']]; 
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }
  public function saveObject($data, $files){
    try {
      $objectData = $this->buildObjectData($data, $files);
      $sqlObject = $this->buildInsert("model_object", $objectData);
      $this->prepared($sqlObject, $objectData);
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  private function buildObjectData($data, $files){
    $modelExt = pathinfo($files['thumb']["name"], PATHINFO_EXTENSION);
    // $thumbExt = pathinfo($files['thumb']["name"], PATHINFO_EXTENSION);
    $objectArray = [
      'model' => $data['model'],
      'object' => $this->uuid.".".$modelExt,
      // 'thumbnail' => $this->uuid.".".$thumbExt,
      'author' => $data['author'],
      'updated_by' => $data['author'],
      'owner' => $data['owner'],
      'license' => $data['license'],
      'description' => $data['object_description'],
      'uuid' => $this->uuid
    ];
    if(isset($data['object_note'])){$objectArray['note']=$data['object_note'];}
    return $objectArray;
  }

  private function buildObjectView(array $data){
    $paramArray = [
      'model' => $data['model'],
      'default_view' => $data['default_view'],
      'grid' => $data['grid'],
      'lightDir' => $data['lightDir'],
      'lighting' => $data['lighting'],
      'ortho' => $data['ortho'],
      'solid' => $data['solid'],
      'specular' => $data['specular'],
      'texture' => $data['texture'],
      'viewside' => $data['viewside'],
      'xyz' => $data['xyz']
    ];
    return $paramArray;
  }

  private function buildObjectParam(array $data){
    $paramArray = [
      'object' => $data['object'],
      'acquisition_method' => $data['acquisition_method'],
      'software' => $data['software'],
      'points' => $data['points'],
      'polygons' => $data['polygons'],
      'textures' => $data['textures'],
      'scans' => $data['scans'],
      'pictures' => $data['pictures'],
      'encumbrance' => $data['encumbrance'],
      'measure_unit' => $data['measure_unit']
    ];
    return $paramArray;
  }

  private function handle3dFile($file){
    $allowed = ["nxz", "nxs", "ply"];
    $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $newName = $this->uuid.".".$ext;
    if (!$file["tmp_name"]) { 
      throw new \Exception("Please browse for a file before clicking the upload button.", 1); 
    }
    if($file["type"] !== 'application/octet-stream'){
      throw new \Exception("Sorry but you can upload only nxz files. You are trying to upload a ".$file["type"]." file type", 1); 
    }
    if (!in_array($ext, $allowed)) { 
      throw new \Exception($ext." - Invalid 3d model file"); 
    }
    if(!move_uploaded_file($file["tmp_name"], $this->modelDir.$newName)){
      throw new \Exception("move_uploaded_file function failed, view server log for more details", 1);
    }
    chmod($this->modelDir.$newName, 0777);
    unlink($this->modelPreview.$file["name"]);
    return true;
  }

  private function handleImg($file){
    $allowed = ["jpg", "jpeg", "png"];
    $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $newName = $this->uuid.".".$ext;
    if (!in_array($ext, $allowed)) { 
      throw new \Exception($ext." - Invalid image file type",1); 
    }
    if (!$file["tmp_name"]) { 
      throw new \Exception("Please browse for a file before clicking the upload button.", 1); 
    }
    if(!move_uploaded_file($file["tmp_name"], $this->thumbDir.$newName)){
      throw new \Exception("move_uploaded_file function failed, view server log for more details", 1);
    }
    chmod($this->thumbDir.$newName, 0777);
    return true;

    //prima di scalare l'immagine devo caricarla sul server
  }

  public function buildGallery(string $sortBy, $filterArr= array()){
    $filter = empty($filterArr) ? "" : " where ". join(" and ", $filterArr);
    $sql = "select artifact.id, artifact.name, coalesce(artifact.description, 'no description available','') description, class.id as category_id, class.value as category, material.id as material_id, coalesce(material.value, null, 'not defined') as material, artifact.start, artifact.end, obj.object, obj.thumbnail from artifact inner join list_category_class class on artifact.category_class = class.id inner join artifact_material_technique amt on amt.artifact = artifact.id inner join artifact_model am on artifact.id = am.artifact inner join model_object obj on obj.model = am.model left join list_material_specs material on amt.material = material.id ".$filter." order by ".$sortBy.";";
    return $this->simple($sql);
  }

  public function getModel(int $id){
    $out['model'] = $this->simple("select * from model where id = ".$id.";")[0];
    $out['model_biblio'] = $this->simple("select * from model_biblio where model = ".$id.";");
    $out['model_object'] = $this->simple("select obj.id, obj.object, obj.thumbnail, status.value status, obj.author author_id, concat(author.first_name,' ',author.last_name) author, obj.owner owner_id, owner.name owner, obj.license license_id, license.license license, license.acronym license_acronym, license.link license_link, obj.create_at, obj.updated_at, obj.updated_by, obj.description, obj.note, obj.uuid, method.value AS acquisition_method, param.software, param.points, param.polygons, param.textures, param.scans, param.pictures, param.encumbrance, param.measure_unit from model_object obj inner join list_item_status status ON obj.status = status.id inner join user on obj.author = user.id inner join person author on user.person = author.id inner join institution owner on obj.owner = owner.id inner join license on obj.license = license.id inner join model_param param on param.object = obj.id inner join list_model_acquisition method on param.acquisition_method = method.id where model =".$id.";");
    $out['model_view'] = $this->simple("select * from model_view where model = ".$id." and default_view = true;")[0];
    return $out;
  }

  public function getModels(array $search){
    $filter = [];
    if($search['status'] > 0){
      array_push($filter, "m.status = ".$search['status']);
    }else {
      array_push($filter, "m.status > ".$search['status']);
    }
    // if($_SESSION['role'] > 4){array_push($filter, "author = ".$_SESSION['id']);}
    // if(isset($search['connected'])){
    //   array_push($filter,"m.id not in (select model from artifact_model)");
    // }
    if(count($filter) > 0 ){ $filter = "where ".join(" and ", $filter);}
    $sql = "select m.id, m.name, m.create_at, m.description, m.status, m.thumbnail, concat(person.last_name, ' ', person.first_name) author, count(o.id) object from model m inner join model_object o on o.model = m.id inner join user on m.created_by = user.id inner join person on user.person = person.id ".$filter." group by m.id, m.name, m.create_at, m.description, m.status, m.thumbnail order by m.create_at desc;";
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
