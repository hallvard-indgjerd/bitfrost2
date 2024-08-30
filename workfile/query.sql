select 
m.id, m.name
, m.create_at
, m.description
, m.status
, m.thumbnail
, concat(person.last_name, ' ', person.first_name) author
, count(o.id) object 
from model m 
inner join model_object o on o.model = m.id 
inner join user on m.created_by = user.id 
inner join person on user.person = person.id 
where m.id not in (select model from artifact_model)
group by m.id, m.name, m.create_at, m.description, m.status, m.thumbnail 
order by m.create_at desc;