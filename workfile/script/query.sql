SELECT m.id, m.name, m.description, m.status, o.thumbnail, o.create_at
FROM model m
inner JOIN (
    SELECT o1.*
    FROM model_object o1
    INNER JOIN (
        SELECT model, MIN(id) AS obj_id
        FROM model_object
        GROUP BY model
    ) o2 ON o1.id = o2.obj_id
) o ON m.id = o.model
where o.author = 21;
