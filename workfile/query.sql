select nation.name nation, county.id county_id, county.name county,city.id city_id, city.name city, f.parish, f.toponym, f.latitude, f.longitude, f.findplace_notes notes 
from artifact_findplace f 
inner join county on f.county = county.id 
inner join nation on county.nation = nation.id 
left join city on f.city = city.id 
where f.artifact = 430