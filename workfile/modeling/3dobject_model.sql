drop table if exists model_init;
drop table if exists model_param;
drop table if exists model_metadata;
drop table if exists model;
create table model(
  id int primary key auto_increment,
  artifact int not null,
  nxz varchar(2000) not null,
  thumb_256 varchar(2000) not null,
  thumb_512 varchar(2000) not null,
  description text not null,
  notes text,
  constraint model_artifact_fk foreign key (artifact) references artifact(id) on delete cascade
)ENGINE=INNODB;

create table model_init(
  model integer primary key,
  ortho boolean default false,
  view bigint unsigned,
  light text,
  texture boolean default false,
  solid boolean default false,
  lighting boolean default true,
  diffuse boolean default false,
  grid bigint unsigned default 1,
  xyz_axes boolean default false,
  constraint mod_init_model_fk foreign key (model) references model(id) on delete cascade,
  constraint mod_init_view_fk foreign key (view) references list_model_view(id),
  constraint mod_init_grid_fk foreign key (grid) references list_model_grid(id) on delete cascade
)ENGINE=INNODB;

create table model_param(
  model integer primary key,
  software text not null,
  points bigint,
  polygons bigint,
  textures bigint,
  scans bigint,
  pictures bigint,
  encumbrance bigint,
  constraint mod_param_model_fk foreign key (model) references model(id) on delete cascade
)ENGINE=INNODB;

create table model_metadata(
  id serial primary key,
  model integer not null,
  author integer not null,
  owner bigint unsigned not null,
  license bigint unsigned not null,
  create_at timestamp not null default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  updated_by integer not null,
  constraint mod_meta_model_fk foreign key (model) references model(id) on delete cascade,
  constraint mod_meta_author_fk foreign key (author) references user(id) on delete cascade,
  constraint mod_meta_owner_fk foreign key (owner) references institution(id) on delete cascade,
  constraint mod_meta_license_fk foreign key (license) references license(id) on delete cascade,
  constraint mod_meta_up_by_fk foreign key (updated_by) references user(id) on delete cascade
)ENGINE=INNODB;
