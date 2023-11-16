CREATE TABLE `license` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `license` varchar(100) NOT NULL,
  `acronym` varchar(100) NOT NULL,
  `link` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `license` (`license`),
  UNIQUE KEY `acronym` (`acronym`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci