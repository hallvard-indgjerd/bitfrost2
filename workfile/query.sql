-- explain WITH ArtifactsWithMaterial AS (
--         SELECT artifact.id AS artifact_id
--         FROM artifact
--         INNER JOIN artifact_material_technique amt ON amt.artifact = artifact.id
--         LEFT JOIN list_material_specs material ON amt.material = material.id
--         WHERE material.id = 20
--         GROUP BY artifact.id
--       )
--       SELECT 
--         artifact.id,
--         artifact.name,
--         COALESCE(artifact.description, 'no description available') AS description,
--         class.id AS category_id,
--         class.value AS category,
--         JSON_OBJECTAGG(material.id, material.value) AS material,
--         artifact.start,
--         artifact.end,
--         obj.object,
--         obj.thumbnail 
--       FROM artifact 
--       INNER JOIN list_category_class class ON artifact.category_class = class.id 
--       INNER JOIN artifact_material_technique amt ON amt.artifact = artifact.id 
--       INNER JOIN artifact_model am ON artifact.id = am.artifact 
--       INNER JOIN model_object obj ON obj.model = am.model 
--       LEFT JOIN list_material_specs material ON amt.material = material.id
--       WHERE artifact.id IN (SELECT artifact_id FROM ArtifactsWithMaterial)
--       GROUP BY artifact.id, artifact.name, class.id, class.value, artifact.start, artifact.end, obj.object, obj.thumbnail
--       ORDER BY artifact.name asc;

-- explain 
SELECT 
    artifact.id,
    artifact.name,
    COALESCE(artifact.description, 'no description available') AS description,
    class.id AS category_id,
    class.value AS category,
    JSON_OBJECTAGG(material.id, material.value) AS material,
    artifact.start,
    artifact.end,
    obj.object,
    obj.thumbnail 
FROM artifact 
INNER JOIN list_category_class class ON artifact.category_class = class.id 
INNER JOIN artifact_material_technique amt ON amt.artifact = artifact.id 
INNER JOIN artifact_model am ON artifact.id = am.artifact 
INNER JOIN model_object obj ON obj.model = am.model 
LEFT JOIN list_material_specs material ON amt.material = material.id
WHERE artifact.id IN (
    SELECT artifact.id
    FROM artifact
    INNER JOIN artifact_material_technique amt ON amt.artifact = artifact.id
    LEFT JOIN list_material_specs material ON amt.material = material.id
    WHERE material.id = 20
    GROUP BY artifact.id
)
GROUP BY artifact.id, artifact.name, class.id, class.value, artifact.start, artifact.end, obj.object, obj.thumbnail
ORDER BY artifact.name ASC;