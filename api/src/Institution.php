<?php
namespace Adc;
session_start();
use \Adc\File;
class Institution extends Conn{
  public $fileCls;
  public $logoFolder;
  function __construct(){
    $this->fileCls = new File();
    $this->logoFolder = $_SERVER['DOCUMENT_ROOT']."/prototype/img/logo/";
  }

  public function catList(){
    return $this->simple("select distinct c.id, c.value from list_institution_category c inner join institution i on i.category = c.id order by 2 asc;");
  }

  public function getInstitutions(array $search){
    $filters = [];
    $search['cat'] = (int) $search['cat'];
    array_push($filters, $search['cat'] == 0 ? 'cat.id > 0' : 'cat.id = '.$search['cat']);
    if(isset($search['name'])){
      $searchByName = [];
      $string = trim($search['name']);
      $arrString = explode(" ",$string);
      foreach ($arrString as $value) {
        if(strlen($value)>3){ 
          array_push($searchByName, "i.name like '%".$value."%'"); 
          array_push($searchByName, "i.abbreviation like '%".$value."%'"); 
        }
      }
      array_push($filters, "(".join(" or ", $searchByName).")");
    }
    $joinFilters = join(" and ", $filters);
    $where = "where ".$joinFilters; 
    $sql = "SELECT i.id, i.name, i.abbreviation, cat.id as category_id, cat.value AS category, i.city, i.address, i.lat, i.lon, i.url, i.logo, COALESCE(b.tot, 0) AS artifact_count
     FROM institution i
     INNER JOIN list_institution_category cat ON i.category = cat.id
     LEFT JOIN (SELECT owner, COUNT(*) AS tot FROM artifact GROUP BY owner) b ON b.owner = i.id
     ".$where." ORDER BY i.id ASC;";
    return $this->simple($sql);
  }

  public function getInstitution(int $id){
    $sql="select i.is_storage_place, i.color, i.category catid, cat.value category, i.name, i.abbreviation, i.city, i.address, i.lat, i.lon, i.url, i.logo, i.uuid FROM institution i INNER JOIN list_institution_category cat ON i.category = cat.id where i.id = ".$id.";";
    return $this->simple($sql)[0];
  }

  public function addInstitution(array $dati, $file){
    // return [$dati, $file];
    try {
      if(count($file) > 0){
        // $folder = $_SERVER['DOCUMENT_ROOT']."/prototype/img/logo/";
        $ext = explode('.', $file['logo']['name']);
        $ext = array_pop($ext);
        $ext = mb_strtolower(strval($ext));
        $dati['logo'] = $dati['abbreviation']."_logo.".$ext;
        $this->fileCls->upload($file['logo'],$this->logoFolder,$dati['logo'], 'image');
      }
      $sql = $this->buildInsert('institution', $dati);
      $this->prepared($sql, $dati);
      return ["res"=>1, "output"=>'Ok, the item has been successfully created'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }
  
  public function editInstitution(array $dati, $file){
    try {
      if(count($file) > 0){
        $logo = $this->simple("select logo from institution where id = ".$dati['id'].";");
        if ($logo[0]['logo']) {
          $path = $this->logoFolder.$logo[0]['logo'];
          $this->fileCls->deleteFile($path);
        }
        $ext = explode('.', $file['logo']['name']);
        $ext = array_pop($ext);
        $ext = mb_strtolower(strval($ext));
        $dati['logo'] = $dati['abbreviation']."_logo.".$ext;
        $this->fileCls->upload($file['logo'],$this->logoFolder,$dati['logo'], 'image');
      }
      $sql = $this->buildupdate('institution',array("id"=>$dati['id']), $dati );
      $this->prepared($sql, $dati);
      return ["res"=>1, "output"=>'Ok, the item has been successfully updated'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function deleteInstitution(int $id){
    try {
      $logo = $this->simple("select logo from institution where id = ".$id.";");
      if ($logo[0]['logo']) {
        // $folder = $_SERVER['DOCUMENT_ROOT']."/prototype/img/logo/";
        $path = $this->logoFolder.$logo[0]['logo'];
        $this->fileCls->deleteFile($path);
      }
      $dati = array("id"=>$id);
      // $sql = $this->buildDelete('institution', $dati);
      $sql = "delete from institution where id = :id;";
      $this->prepared($sql,$dati);
      return ["res"=>1, "output"=>'Ok, the item has been successfully deleted'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

}
?>
