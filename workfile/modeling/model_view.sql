drop table if exists model_view;
create table model_view(
  model int,
  default_view boolean not null default false,
  grid varchar(256) not null default 'gridBase',
  lightdir varchar(256) not null default '0,0',
  lighting boolean not null default false,
  ortho boolean not null default false,
  solid boolean not null default false,
  specular boolean not null default false,
  texture boolean not null default false,
  viewside varchar(256) not null default '15,15,0,0,0,2',
  xyz boolean not null default false,
  CONSTRAINT PRIMARY KEY (model),
  CONSTRAINT FOREIGN KEY (model) REFERENCES model(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;