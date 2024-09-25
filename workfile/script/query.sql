SELECT i.id, i.name, i.abbreviation, cat.id as category_id, cat.value AS category, i.city, i.address, i.lat, i.lon, i.url, i.logo, COALESCE(b.tot, 0) AS artifact_count
     FROM institution i
     INNER JOIN list_institution_category cat ON i.category = cat.id
     LEFT JOIN (SELECT owner, COUNT(*) AS tot FROM artifact GROUP BY owner) b ON b.owner = i.id
    ORDER BY i.id ASC;