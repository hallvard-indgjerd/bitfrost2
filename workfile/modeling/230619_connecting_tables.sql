-- SET autocommit = 0;
START TRANSACTION;
drop table if EXISTS artifact_biblio;
drop table IF EXISTS artifact_model;
drop table if EXISTS model_biblio;
drop table bibliography;
create table bibliography(
  id integer auto_increment primary key,
  artifact integer,
  reference text
);
insert into bibliography(artifact, reference) select artifact, reference from complete_collection;
delete from bibliography where reference is null;

create table artifact_model(
  artifact int not null,
  model int not null unique,
  PRIMARY KEY (artifact, model),
  CONSTRAINT am_artifact_fk FOREIGN KEY(artifact) REFERENCES artifact(id) on delete cascade,
  CONSTRAINT am_model_fk FOREIGN KEY(model) REFERENCES model(id) on delete cascade
) ENGINE=INNODB;
create table artifact_biblio(
  artifact int not null,
  reference int not null,
  PRIMARY KEY (artifact, reference),
  CONSTRAINT ab_artifact_fk FOREIGN KEY(artifact) REFERENCES artifact(id) on delete cascade,
  CONSTRAINT ab_biblio_fk FOREIGN KEY(reference) REFERENCES bibliography(id) on delete cascade
) ENGINE=INNODB;

create table model_biblio(
  model int not null,
  reference int not null,
  PRIMARY KEY (model, reference),
  CONSTRAINT mb_model_fk FOREIGN KEY(model) REFERENCES model(id) on delete cascade,
  CONSTRAINT mb_biblio_fk FOREIGN KEY(reference) REFERENCES bibliography(id) on delete cascade
) ENGINE=INNODB;
--
insert into artifact_model(artifact, model) select artifact, id from model order by 1 asc;
insert into artifact_biblio(artifact, reference) select artifact, id from bibliography  order by 1 asc;
ALTER TABLE bibliography DROP column artifact;
alter table model drop foreign key model_artifact_fk;
alter table model drop column artifact;
COMMIT;
-- set autocommit = 1;
