select 
  concat(auth.first_name,' ',auth.last_name) auth, 
  owner.name owner, 
  license.license, 
  license.acronym, 
  license.link licenseLink, 
  item.create_at, 
  item.updated_at
from model_metadata item
inner join user on item.author = user.id
inner join person auth on user.person = auth.id
inner join institution owner on item.owner = owner.id
inner join license on item.license = license.id