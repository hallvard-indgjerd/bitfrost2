SELECT
    macro.id AS macro_id
    ,macro.definition AS macro_definition
    ,MIN(spec.start) AS macro_min_start
    ,MAX(spec.end) AS macro_max_end
    ,generic.id AS generic_id
    ,generic.definition AS generic_definition
    ,MIN(spec.start) AS generic_min_start
    ,MAX(spec.end) AS generic_max_end
    ,spec.id AS specific_id
    ,spec.definition AS specific_definition
    ,spec.start AS specific_start
    ,spec.end AS specific_end
FROM  time_series_macro macro
JOIN  time_series_generic generic ON generic.macro = macro.id
JOIN  time_series_specific spec ON spec.generic = generic.id
GROUP BY macro.id, generic.id, spec.id
ORDER BY macro.id, generic.id, spec.id
;
