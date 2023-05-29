BEGIN;
drop table if exists list_inst_cat;
drop table if exists list_person_cat;
drop table if exists list_user_role;
drop table if exists institution;
drop table if exists user;
drop table if exists person;
CREATE TABLE list_inst_cat(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY `UNIQ_INST_CAT` (`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE list_person_cat(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_PERSON_CAT (value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE list_user_role(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_USER_ROLE (value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO list_inst_cat(value) values ('Museum'), ('University'), ('Biblioteque'), ('Public administration');
INSERT INTO list_person_cat(value) values ('Researcher'), ('PhD'), ('Professor'), ('Student');
INSERT INTO list_user_role(value) values ('Administrator'), ('Supervisor'), ('Editor'), ('Reviewer'), ('Author'), ('Researcher');
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
  institution INT NOT NULL,
  position INT NOT NULL,
  city varchar(256) NOT NULL,
  address varchar(256),
  phone VARCHAR(20),
  website VARCHAR(256),
  user_id INT,
  UNIQUE KEY UNIQ_PERSON_EMAIL (email),
  CONSTRAINT FK_PERSON_INSTITUTION FOREIGN KEY (institution) REFERENCES institution (id) ON DELETE CASCADE,
  CONSTRAINT FK_PERSON_CATEGORY FOREIGN KEY (position) REFERENCES list_person_cat (id) ON DELETE CASCADE,
  CONSTRAINT FK_PERSON_USER FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
  KEY IDX_PERSON_CITY (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;
