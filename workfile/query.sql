select nation.name, county.name, city.name, f.parish, f.toponym, f.lat, f.lon, f.findplace_notes
from artifact_findplace f
inner join city on f.city = city.id
inner join county on f.county = county.id
inner join nation on county.nation = nation.id
where f.artifact = 422;
