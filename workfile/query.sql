select i.name, i.color,count(*) tot
from institution i
inner join artifact a on a.storage_place = i.id
where a.category_class = 10
group by i.name, i.color;