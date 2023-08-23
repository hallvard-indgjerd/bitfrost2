WITH
  artifact AS (select u.id, u.name, u.role_id, role.value role, u.is_active, count(artifact.id) tot from user u inner join list_user_role role on u.role_id = role.id left join artifact on artifact.author = u.id group by u.id, u.name),
  model AS (select u.id, count(model.id) tot from user u left join model_metadata model on model.author = u.id group by u.id, u.name)
SELECT artifact.id, artifact.name, artifact.role, artifact.is_active, artifact.tot artifact, model.tot model FROM artifact JOIN model
WHERE artifact.id = model.id
ORDER BY artifact.name asc;
