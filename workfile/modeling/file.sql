SET FOREIGN_KEY_CHECKS=0;
DROP TABLE if exists list_file_type ;
CREATE TABLE list_file_type(
  `id` SMALLINT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(25),
  PRIMARY KEY(id), 
  UNIQUE KEY(value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

DROP TABLE if exists file ;
CREATE TABLE file(
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` SMALLINT,
  `path` VARCHAR(256),
  PRIMARY KEY(id),
  CONSTRAINT FOREIGN KEY (type) REFERENCES list_file_type(id) ON DELETE set null,
  UNIQUE KEY(path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

SET FOREIGN_KEY_CHECKS=1;

INSERT INTO list_file_type(value) values
('model'),
('thumb'),
('document'),
('video'),
('audio');