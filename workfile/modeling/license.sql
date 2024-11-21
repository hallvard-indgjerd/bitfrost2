-- CREATE TABLE `license` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `license` varchar(100) NOT NULL,
--   `acronym` varchar(100) NOT NULL,
--   `link` varchar(2000) DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `id` (`id`),
--   UNIQUE KEY `license` (`license`),
--   UNIQUE KEY `acronym` (`acronym`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


-- start transaction;

-- update license set file = 'Public_Domain_Mark_PD.txt' where id = 1;
-- update license set file = 'CC0_1.0.txt' where id = 2;
-- update license set file = 'CC_BY_4.0.txt' where id = 3;
-- update license set file = 'CC_BY-SA_4.0.txt' where id = 4;
-- update license set file = 'CC_BY-ND_4.0.txt' where id = 5;
-- update license set file = 'CC_BY-NC_4.0.txt' where id = 6;
-- update license set file = 'CC_BY-NC-SA_4.0.txt' where id = 7;
-- update license set file = 'CC_BY-NC-ND_4.0.txt' where id = 8;

-- commit;