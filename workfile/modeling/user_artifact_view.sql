create or replace view user_artifact_view as 
with 
  user as (
    select p.id person_id, u.id user_id, concat(p.first_name,' ',p.last_name) name, role.value role, u.is_active
    from person p
    inner join user u on u.person = p.id
    INNER JOIN list_user_role role on u.role = role.id
  ),
  artifact as (
    select user.user_id author, coalesce(count(artifact.id),0) tot from user left join artifact on artifact.author = user.user_id group by user.user_id
  ),
  model as (
    select user.user_id author, coalesce(count(model.id),0) tot from user left join model_object model on model.author = user.user_id group by user.user_id
  )
select user.*, artifact.tot artifact, model.tot model
from user
inner join model on model.author = user.user_id
inner join artifact on artifact.author = user.user_id
order by user.name asc;