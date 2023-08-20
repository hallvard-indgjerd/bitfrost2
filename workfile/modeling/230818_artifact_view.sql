create or replace view artifact_view as
select
  a.id,
  a.name,
  a.status status_id,
  status.value status,
  a.storage_place,
  a.inventory,
  a.conservation_state conservation_state_id,
  conservation.value conservation_state,
  a.object_condition object_condition_id,
  object_condition.value object_condition,
  a.is_museum_copy,
  a.category_class category_class_id,
  category_class.value category_class,
  a.category_specs category_specs_id,
  category_specs.value category_specs,
  a.type,
  a.start,
  a.end,
  a.description,
  a.notes,
  a.author,
  a.owner,
  a.license,
  a.created_at,
  a.last_update
from artifact a
inner join list_item_status status on a.status = status.id
inner join list_conservation_state conservation on a.conservation_state = conservation.id
left join list_category_class category_class on a.category_class = category_class.id
left join list_category_specs category_specs on a.category_specs = category_specs.id
left join list_object_condition object_condition on a.object_condition = object_condition.id
order by a.id asc;
