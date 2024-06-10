DROP TABLE if exists files;
create table files(
  `id` SMALLINT AUTO_INCREMENT,
  `artifact` INT NOT NULL,
  `type` ENUM('image','document','video','audio') NOT NULL,
  `path` varchar(256),
  `url` varchar(256),
  `text` text,
  PRIMARY KEY(id),
  CONSTRAINT FOREIGN KEY (`artifact`) REFERENCES `artifact` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;