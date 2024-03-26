-- explain
-- with 
-- props AS (select county, count(*) tot from artifact_findplace group by county),
-- geom as (select id, name, shape from county)
-- select geom.id, geom.name, st_asgeojson(geom.shape) geom, props.tot from props inner join geom on props.county = geom.id;

SELECT c.name, /*st_asgeojson(c.shape) AS 'geometry',*/ a.tot
FROM (
  SELECT county, COUNT(*) AS tot
  FROM artifact_findplace 
  GROUP BY county 
) AS a
JOIN county AS c  ON a.county = c.id;