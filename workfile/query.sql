select material.value material, item.technique, item.notes material_notes
from artifact_material_technique item
left join list_material_specs material on item.material = material.id
where item.artifact = 198 \G
