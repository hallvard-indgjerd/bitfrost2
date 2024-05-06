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

  public function getInstitutions(){
    $sql = "with 
    a as (select i.id, i.name, i.abbreviation, cat.value category, i.city, i.address, i.lat, i.lon, i.url, i.logo from institution i inner join list_institution_category cat on i.category = cat.id),
    b as (select owner, count(*) tot from artifact group by owner)
    select a.*, ifnull(b.tot,0) artifact
    from a
    left join b on b.owner = a.id 
    order by a.id asc;";
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
