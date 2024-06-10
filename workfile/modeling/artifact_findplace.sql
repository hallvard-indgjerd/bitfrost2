drop table if exists `artifact_findplace`;
create table `artifact_findplace` (
  `artifact` int primary key, 
  `county` int not null,
  `city` int,
  `parish` varchar(250),
  `toponym` varchar(250),
  `longitude` decimal(10,6),
  `latitude` decimal(10,6),
  `findplace_notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `artifact_findplace` ADD FOREIGN KEY (`artifact`) REFERENCES `artifact` (`id`) on delete cascade;
ALTER TABLE `artifact_findplace` ADD FOREIGN KEY (`county`) REFERENCES `county` (`id`) on delete cascade;
ALTER TABLE `artifact_findplace` ADD FOREIGN KEY (`city`) REFERENCES `city` (`id`) on delete cascade;