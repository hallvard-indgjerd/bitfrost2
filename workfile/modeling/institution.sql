CREATE TABLE `institution` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` bigint unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(5) NOT NULL,
  `city` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` decimal(10,6) DEFAULT NULL,
  `lon` decimal(10,6) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `logo` varchar(256) DEFAULT NULL,
  `uuid` varchar(36) DEFAULT (uuid()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `abbreviation` (`abbreviation`),
  KEY `inst_cat_fk` (`category`),
  KEY `city` (`city`),
  CONSTRAINT `inst_cat_fk` FOREIGN KEY (`category`) REFERENCES `list_institution_category` (`id`),
  CONSTRAINT `institution_ibfk_1` FOREIGN KEY (`city`) REFERENCES `city` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE list_institution_category(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY `UNIQ_INST_CAT` (`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

