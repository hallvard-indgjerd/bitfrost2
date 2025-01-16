select 
 concat('https://dyncolldev.ht.lu.se/plus/artifact_view.php?item=',artifact.id) as link,
 model.doi,
 artifact.name,
 class.value as class,
 typology.value as specific_class,
 artifact.type as typology,
 artifact.start as start_chronology,
 artifact.end as end_chronology,
 conservation.value as conservation_state,
 list_object_condition.value as object_condition,
 if(artifact.is_museum_copy = 1, 'true', 'false') as is_museum_copy,
 artifact.description,
 artifact.notes,
 concat(auth.first_name,' ',auth.last_name) author,
 o.name owner,
 artifact.inventory,
 concat(license.license,' (',license.acronym,')') as license,
 cast(artifact.created_at as date) created_at,
 cast(artifact.last_update as date) last_update
from artifact
inner join artifact_model am on am.artifact = artifact.id
inner join model on am.model = model.id
inner join institution o on artifact.owner = o.id
inner join user on artifact.author = user.id
inner join person auth on user.person = auth.id
inner join license on artifact.license = license.id
inner join list_category_class class on artifact.category_class = class.id
inner join list_category_specs typology on artifact.category_specs = typology.id
inner join list_conservation_state conservation on artifact.conservation_state = conservation.id
inner join list_object_condition on artifact.object_condition = list_object_condition.id
where artifact.status = 2
order by artifact.id asc;