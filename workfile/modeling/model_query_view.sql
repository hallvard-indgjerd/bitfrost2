create or replace view model_query_view as
select 
  obj.id,
  obj.model,
  obj.object,
  obj.thumbnail,
  obj.status status_id,
  status.value status,
  obj.author author_id,
  concat(person.first_name,' ',person.last_name) author,
  obj.owner owner_id,
  obj.license license_id,
  license.license,
  license.acronym license_acronym,
  license.link license_link,
  obj.create_at,
  obj.updated_at,
  obj.updated_by,
  obj.description,
  obj.note,
  obj.uuid,
  param.acquisition_method method_id,
  method.value acquisition_method,
  param.software,
  param.points,
  param.polygons,
  param.textures,
  param.scans,
  param.pictures,
  param.encumbrance,
  param.measure_unit
from model_object obj 
inner join model_param param on param.object=obj.id
inner join list_item_status status on obj.status = status.id
inner join user on obj.author = user.id
inner join person on user.person = person.id
inner join license on obj.license = license.id
inner join list_model_acquisition method on param.acquisition_method = method.id;