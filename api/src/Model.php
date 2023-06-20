<?php
namespace Adc;
session_start();
class Model extends Conn{
  function __construct(){}

  public function buildGallery(string $sortBy, $filterArr= array()){
    $filter = empty($filterArr) ? "" : " where ". join(" and ", $filterArr);
    $sql = "select artifact.id, artifact.name, coalesce(artifact.description, 'no description available','') description, class.id as category_id, class.value as category, material.id as material_id, coalesce(material.value, null, 'not defined') as material, artifact.start, artifact.end, model.nxz, model.thumb_256
    from artifact
    inner join list_category_class class on artifact.category_class = class.id
    inner join artifact_material_technique amt on amt.artifact = artifact.id
    inner join artifact_model am on artifact.id = am.artifact
    inner join model on model.id = am.model
    left join list_material_specs material on amt.material = material.id ".$filter." order by ".$sortBy.";";
    return $this->simple($sql);
  }

  public function getArtifact(int $id){
    $artifact = "select a.name, status.value status, a.inventory, a.storage_place, conservation.value conservation_state, category_class.value category_class, category_specs.value category_specs, coalesce(a.type, 'not defined', null) type, list_object_condition.value object_condition, a.is_museum_copy, a.description, a.start, a.end, coalesce(a.notes, '',null) notes from artifact a inner join list_item_status status on a.status = status.id inner join list_conservation_state conservation on a.conservation_state = conservation.id left join list_category_class category_class on a.category_class = category_class.id left join list_category_specs category_specs on a.category_specs = category_specs.id left join list_object_condition on a.object_condition = list_object_condition.id where a.id = ".$id.";";
    $out['artifact'] = $this->simple($artifact)[0];
    if (!empty($out['artifact']['start'])) { $out['start_period'] = $this->getChronology($out['artifact']['start']); }
    if (!empty($out['artifact']['end'])) { $out['end_period'] = $this->getChronology($out['artifact']['end']); }
    $out['artifact_metadata'] = $this->getArtifactMetadata($id)[0];
    $out['artifact_measure'] = $this->getArtifactMeasure($id)[0];
    $out['artifact_findplace'] = $this->getArtifactFindplace($id)[0];
    $out['artifact_material_technique'] = $this->getArtifactMaterial($id)[0];
    $out['storage_place'] = $this->getInstitution($out['artifact']['storage_place'])[0];
    return $out;
  }

  private function getChronology(int $year){
    $sql = "select * from nordic_generic_period where ".$year." between start and end order by id";
    return $this->simple($sql);
  }
  private function getArtifactMetadata(int $id){
    $sql = "select auth.name auth, owner.name owner, license.license, license.acronym, license.link licenseLink, item.create_at, item.updated_at
    from artifact_metadata item
    inner join user auth on item.author = auth.id
    inner join institution owner on item.owner = owner.id
    inner join license on item.license = license.id
    where item.artifact = ".$id.";";
    return $this->simple($sql);
  }

  private function getInstitution(int $id){
    $sql = "select i.name, i.abbreviation, cat.value category, cities.name city, i.address, i.lat, i.lon, i.link from artifact a inner join institution i on a.storage_place = i.id inner join list_institution_category cat on i.category = cat.id inner join cities on i.city = cities.id where a.id = ".$id.";";
    return $this->simple($sql);
  }
  private function getArtifactMeasure(int $id){ return $this->simple("select * from artifact_measure where artifact = ".$id.";"); }
  private function getArtifactFindplace(int $id){ return $this->simple("select cities.name city, item.* from artifact_findplace item left join cities on item.city = cities.id where item.artifact = ".$id.";");}
  private function getArtifactMaterial(int $id){ return $this->simple("select material.value material, item.technique, item.notes material_notes from artifact_material_technique item inner join list_material_specs material on item.material = material.id where item.artifact = ".$id.";");}
}
?>
