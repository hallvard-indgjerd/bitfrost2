BEGIN;
-- drop table if exists list_inst_cat;
-- drop table if exists list_person_cat;
-- drop table if exists list_user_role;
drop table if exists list_material_class;
drop table if exists list_material_specs;
-- CREATE TABLE list_inst_cat(
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   value varchar(100) NOT NULL,
--   UNIQUE KEY `UNIQ_INST_CAT` (`value`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- INSERT INTO list_inst_cat(value) values ('Museum'), ('University'), ('Biblioteque'), ('Public administration');
-- CREATE TABLE list_person_cat(
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   value varchar(100) NOT NULL,
--   UNIQUE KEY UNIQ_PERSON_CAT (value)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- INSERT INTO list_person_cat(value) values ('Researcher'), ('PhD'), ('Professor'), ('Student');
-- CREATE TABLE list_user_role(
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   value varchar(100) NOT NULL,
--   UNIQUE KEY UNIQ_USER_ROLE (value)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- INSERT INTO list_user_role(value) values ('Administrator'), ('Supervisor'), ('Editor'), ('Reviewer'), ('Author'), ('Researcher');
CREATE TABLE list_material_class(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_MATERIAL_CLASS (value)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE list_material_specs(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_MATERIAL_SPECS (value)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;
('Stone', 'Amphibolite', 'Amfibolit'),
('Bone', 'Antlers', 'Antler'),
('Stone', 'Basalt', 'Basalt'),
('Alloy', 'Bronze', 'Brons'),
('Metal', 'Copper', 'Koppar'),
('Stone', 'Diabase', 'Diabas'),
('Stone', 'Flint', 'Flinta'),
('Metal', 'Gold', 'Guld'),
('Stone', 'Grindstone', 'Slipsten'),
('Bone', 'Horn', 'Horn'),
('Metal', 'Iron', 'Järn'),
('Metal', 'Lead', 'Bly'),
('Stone', 'Quartzite', 'Kvartsit'),
('Stone', 'Rock', 'Bergart'),
('Stone', 'Sandstone', 'Sandsten'),
('Metal', 'Silver', 'Sølv'),
('Stone', 'Slate', 'Skiffer'),
('Stone', 'Soapstone', 'Täljsten'),
('Metal', 'White metal', 'Vitmetall');
