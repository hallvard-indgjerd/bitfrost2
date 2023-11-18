DROP TABLE if exists list_file_type ;
CREATE TABLE list_file_type(
  `id` SMALLINT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(25),
  PRIMARY KEY(id), 
  UNIQUE KEY(value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

INSERT INTO list_file_type(value) values ('image'),('document'),('video'),('audio');