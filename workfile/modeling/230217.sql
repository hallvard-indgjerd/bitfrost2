BEGIN;
drop table if exists person;
drop table if exists institution;
drop table if exists user;

drop table if exists list_inst_cat;
drop table if exists list_person_cat;
drop table if exists list_user_role;
drop table if exists list_material_specs;
drop table if exists list_material_class;

CREATE TABLE list_inst_cat(
  id INT AUTO_INCREMENT PRIMARY KEY,
  en varchar(100) NOT NULL,
  sv varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_INST_CAT (en, sv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO list_inst_cat(en, sv) values ('Museum', 'Museum'), ('University', 'Universitet'), ('Biblioteque', 'Biblioteque'), ('Public administration', 'Offentlig förvaltning');
CREATE TABLE list_person_cat(
  id INT AUTO_INCREMENT PRIMARY KEY,
  en varchar(100) NOT NULL,
  sv varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_PERSON_CAT (en, sv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO list_person_cat(en, sv) values ('Researcher', 'Forskare'), ('PhD', 'PhD'), ('Professor', 'Professor'), ('Student','Student');
CREATE TABLE list_user_role(
  id INT AUTO_INCREMENT PRIMARY KEY,
  en varchar(100) NOT NULL,
  sv varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_USER_ROLE (en, sv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO list_user_role(en, sv) values ('Administrator', 'Administratör'), ('Supervisor','Supervisor'), ('Editor', 'Editor'), ('Reviewer','Reviewer'), ('Author', 'Author'), ('Researcher', 'Researcher');
CREATE TABLE list_material_class(
  id INT AUTO_INCREMENT PRIMARY KEY,
  en varchar(100) NOT NULL,
  sv varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_MATERIAL_CLASS (en, sv)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
insert into list_material_class(en, sv) values ('Alloy', 'Legering'), ('Bone', 'Ben'), ('Ceramics', 'Keramik'), ('Leather', 'Läder'), ('Metal', 'Metall'), ('Plaster', 'Gips'), ('Stone', 'Sten'), ('Wood', 'Trä');
CREATE TABLE list_material_specs(
  id INT AUTO_INCREMENT PRIMARY KEY,
  class int,
  class_temp varchar(100),
  en varchar(100) NOT NULL,
  sv varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_MATERIAL_SPECS (en, sv),
  CONSTRAINT FK_MATERIAL_CLASS FOREIGN KEY (class) REFERENCES list_material_class (id) ON DELETE CASCADE
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
insert into list_material_specs(class_temp, en, sv) values ('Stone', 'Amphibolite', 'Amfibolit'), ('Bone', 'Antlers', 'Antler'), ('Stone', 'Basalt', 'Basalt'), ('Alloy', 'Bronze', 'Brons'), ('Metal', 'Copper', 'Koppar'), ('Stone', 'Diabase', 'Diabas'), ('Stone', 'Flint', 'Flinta'), ('Metal', 'Gold', 'Guld'), ('Stone', 'Grindstone', 'Slipsten'), ('Bone', 'Horn', 'Horn'), ('Metal', 'Iron', 'Järn'), ('Metal', 'Lead', 'Bly'), ('Stone', 'Quartzite', 'Kvartsit'), ('Stone', 'Rock', 'Bergart'), ('Stone', 'Sandstone', 'Sandsten'), ('Metal', 'Silver', 'Sølv'), ('Stone', 'Slate', 'Skiffer'), ('Stone', 'Soapstone', 'Täljsten'), ('Metal', 'White metal', 'Vitmetall');
update list_material_specs s inner join list_material_class m on s.class_temp = m.en set class = m.id where s.class_temp = m.en;
alter table list_material_specs drop column class_temp;

CREATE TABLE institution(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name varchar(256) NOT NULL,
  category INT NOT NULL,
  private tinyint(1) default 1 NOT NULL,
  city varchar(256) NOT NULL,
  address varchar(256),
  lon DECIMAL(6,4),
  lat DECIMAL(6,4),
  phone VARCHAR(20),
  website VARCHAR(256),
  UNIQUE KEY UNIQ_INSTITUTION (name),
  CONSTRAINT FK_INSTITUTION_CATEGORY FOREIGN KEY (category) REFERENCES list_inst_cat (id) ON DELETE CASCADE,
  KEY IDX_INSTITUTION_CITY (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  email varchar(190) NOT NULL,
  name varchar(190) NOT NULL,
  created  datetime NOT NULL,
  modified datetime,
  password_hash varchar(60),
  role tinyint(1) NOT NULL,
  is_active tinyint(1) NOT NULL,
  UNIQUE KEY UNIQ_USER_EMAIL (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE person(
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name varchar(256) NOT NULL,
  last_name varchar(256) NOT NULL,
  email varchar(256) NOT NULL,
  institution INT,
  position INT NOT NULL,
  city varchar(256) NOT NULL,
  address varchar(256),
  phone VARCHAR(20),
  website VARCHAR(256),
  user_id smallint default 0,
  UNIQUE KEY UNIQ_PERSON_EMAIL (email),
  CONSTRAINT FK_PERSON_INSTITUTION FOREIGN KEY (institution) REFERENCES institution (id) ON DELETE CASCADE,
  CONSTRAINT FK_PERSON_CATEGORY FOREIGN KEY (position) REFERENCES list_person_cat (id) ON DELETE CASCADE,
  KEY IDX_PERSON_CITY (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;