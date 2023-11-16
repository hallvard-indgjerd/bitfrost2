select 
  i.category catid,
  cat.value category,
  i.name,
  i.abbreviation,
  i.city cityid,
  city.name city,
  i.address,
  i.lat,
  i.lon,
  i.url,
  i.logo,
  i.uuid
FROM institution i
INNER JOIN list_institution_category cat ON i.category = cat.id
inner join city on i.city = city.id
where i.id = 3;