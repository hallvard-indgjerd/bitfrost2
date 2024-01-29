select
  obj.id,
  obj.object,
  obj.thumbnail,
  status.value status,
  obj.author author_id,
  concat(author.first_name,' ',author.last_name) author,
  obj.owner owner_id,
  owner.name owner,
  obj.license license_id,
  license.license license,
  license.acronym license_acronym,
  license.link license_link,
  obj.create_at,
  obj.updated_at,
  obj.updated_by,
  obj.description,
  obj.note,
  obj.uuid,
  method.value AS acquisition_method,
  param.software,
  param.points,
  param.polygons,
  param.textures,
  param.scans,
  param.pictures,
  param.encumbrance,
  param.measure_unit 
from model_object obj
inner join list_item_status status ON obj.status = status.id
inner join user on obj.author = user.id
inner join person author on user.person = author.id
inner join institution owner on obj.owner = owner.id
inner join license on obj.license = license.id
inner join model_param param on param.object = obj.id
join list_model_acquisition method on param.acquisition_method = method.id
where model = 260 \G