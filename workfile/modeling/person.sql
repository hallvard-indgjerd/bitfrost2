drop table if exists person;
drop table if exists list_person_position;

CREATE TABLE list_person_position(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_PERSON_CAT (value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO list_person_cat(value) values ('Professor'), ('Researcher'), ('PhD'), ('Student'), ('Administrative personnel');

CREATE TABLE person(
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name varchar(256) NOT NULL,
  last_name varchar(256) NOT NULL,
  email varchar(256) NOT NULL UNIQUE,
  institution BIGINT UNSIGNED,
  position INT,
  city varchar(256),
  address varchar(256),
  phone VARCHAR(100),
  CONSTRAINT FOREIGN KEY (institution) REFERENCES institution (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (position) REFERENCES list_person_position (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
