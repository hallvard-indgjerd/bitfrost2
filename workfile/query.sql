select i.name, i.abbreviation, cat.value category, cities.name city, i.address, i.lat, i.lon, i.link
from artifact a
inner join institution i on a.storage_place = i.id
inner join list_institution_category cat on i.category = cat.id
left join cities on i.city = cities.id
where a.id = 344 \G
