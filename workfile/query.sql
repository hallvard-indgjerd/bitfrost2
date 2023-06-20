select artifact.id, artifact.name, coalesce(artifact.description, 'no description available','') description, class.id as category_id, class.value as category, material.id as material_id, coalesce(material.value, null, 'not defined') as material, artifact.start, artifact.end, model.nxz, model.thumb_256
from artifact
inner join list_category_class class on artifact.category_class = class.id
inner join artifact_material_technique amt on amt.artifact = artifact.id
inner join artifact_model am on artifact.id = am.artifact
inner join model on model.id = am.model
left join list_material_specs material on amt.material = material.id
