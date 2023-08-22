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

CREATE TABLE list_inst_cat(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY `UNIQ_INST_CAT` (`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO list_inst_cat(value) values ('Museum'), ('University'), ('Biblioteque'), ('Public administration');
