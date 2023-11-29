create or replace view user_artifact_view as 
WITH
  artifact AS (
    select 
      u.id, 
      concat(p.first_name,' ', p.last_name) name, 
      u.role role_id, 
      role.value role, 
      u.is_active, 
      count(artifact.id) tot 
    from user u
    inner join person p on u.person = p.id
    inner join list_user_role role on u.role = role.id 
    left join artifact on artifact.author = u.id 
    group by u.id, p.first_name, p.last_name
  ),
  model AS (
    select 
      u.id, 
      count(model.id) tot 
      from user u 
      inner join person p on u.person = p.id
      left join model_object model on model.author = u.id 
      group by u.id, p.first_name, p.last_name
    )
SELECT artifact.id, artifact.name, artifact.role, artifact.is_active, artifact.tot artifact, model.tot model FROM artifact JOIN model
WHERE artifact.id = model.id
ORDER BY artifact.name asc;
