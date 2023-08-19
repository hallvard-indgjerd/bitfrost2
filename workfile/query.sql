select
  material.value material, 
  item.technique
from artifact_material_technique item
inner join list_material_specs material on item.material = material.id
where item.artifact = 422;
