SET FOREIGN_KEY_CHECKS=0;
-- RENAME TABLE model TO model_old;
-- RENAME TABLE model_param TO model_param_old;
-- RENAME TABLE model_view TO model_view_old;
DROP table if exists model;
DROP table if exists model_object;
DROP table if exists model_param;
DROP table if exists model_view;
DROP table if exists artifact_model;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE `model` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(256) UNIQUE NOT NULL,
  `note` text,
  `uuid` varchar(36) DEFAULT (uuid()),
  `old` int
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `model` ADD FOREIGN KEY (`old`) REFERENCES `model_old` (`id`);

CREATE TABLE `model_object` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `model` int NOT NULL,
  `object` varchar(256) UNIQUE NOT NULL,
  `thumbnail` varchar(256) NOT NULL,
  `status` bigint unsigned NOT NULL DEFAULT 1,
  `author` int NOT NULL,
  `owner` bigint unsigned NOT NULL,
  `license` bigint unsigned NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int NOT NULL,
  `description` text NOT NULL,
  `note` text,
  `uuid` varchar(36) DEFAULT (uuid())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `model_object` ADD FOREIGN KEY (`model`) REFERENCES `model` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `model_object` ADD FOREIGN KEY (`status`) REFERENCES `list_item_status` (`id`);
ALTER TABLE `model_object` ADD FOREIGN KEY (`author`) REFERENCES `user` (`id`);
ALTER TABLE `model_object` ADD FOREIGN KEY (`owner`) REFERENCES `institution` (`id`);
ALTER TABLE `model_object` ADD FOREIGN KEY (`license`) REFERENCES `license` (`id`);
ALTER TABLE `model_object` ADD FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`);

CREATE TABLE `model_param` (
  `object` int PRIMARY KEY NOT NULL,
  `acquisition_method` int NOT NULL,
  `software` text,
  `points` bigint,
  `polygons` bigint,
  `textures` bigint,
  `scans` bigint,
  `pictures` bigint,
  `encumbrance` varchar(50),
  `measure_unit` varchar(2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `model_param` ADD FOREIGN KEY (`object`) REFERENCES `model_object` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `model_param` ADD FOREIGN KEY (`acquisition_method`) REFERENCES `list_model_acquisition` (`id`);

create table `model_view`(
  `model` int,
  `default_view` tinyint(1) not null default 0,
  `grid` varchar(256) not null default 'gridBase',
  `lightdir` varchar(256) not null default '0,0',
  `lighting` tinyint(1) not null default 0,
  `ortho` tinyint(1) not null default 0,
  `solid` tinyint(1) not null default 0,
  `specular` tinyint(1) not null default 0,
  `texture` tinyint(1) not null default 0,
  `viewside` varchar(256) not null default '15,15,0,0,0,2',
  `xyz` tinyint(1) not null default 0,
  PRIMARY KEY (`object`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `model_view` ADD FOREIGN KEY (`model`) REFERENCES `model` (`id`) ON DELETE CASCADE;


CREATE TABLE `artifact_model` (
  `artifact` int NOT NULL,
  `model` int NOT NULL,
  PRIMARY KEY (`artifact`, `model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `artifact_model` ADD FOREIGN KEY (`artifact`) REFERENCES `artifact` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `artifact_model` ADD FOREIGN KEY (`model`) REFERENCES `model` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
