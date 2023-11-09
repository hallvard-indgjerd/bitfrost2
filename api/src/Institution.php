<?php
namespace Adc;
session_start();
use \Adc\File;
class Institution extends Conn{
  public $fileCls;
  function __construct(){
    $this->fileCls = new File();
  }

  public function getInstitutions(){
    $sql = "select i.id, i.name, i.abbreviation, cat.value category, city.name city, i.address, i.lat, i.lon, i.url, count(*) artifact
    from institution i
    inner join list_institution_category cat on i.category = cat.id
    inner join city on i.city = city.id
    inner join artifact a on a.owner = i.id
    group by i.id, i.name, i.abbreviation, cat.value , city.name , i.address, i.lat, i.lon, i.url
    order by i.name asc;";
    return $this->simple($sql);
  }

  public function addInstitution(array $dati, $file){
    try {
      $folder = $dati['folder'];
      unset($dati['folder']);
      $ext = explode('.', $file['logo']['name']);
      $ext = array_pop($ext);
      $ext = mb_strtolower(strval($ext));
      $dati['logo'] = $dati['abbreviation']."_logo.".$ext;
      return [$dati, $file];
      // if(count($file) > 0){$this->fileCls->upload($file,$folder,$dati['logo']);}
      // return ["reso"=>1, "output"=>'Ok, the item has been successfully created'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }
  public function editInstitution(array $dati){
    return $dati;
  }

}
?>
