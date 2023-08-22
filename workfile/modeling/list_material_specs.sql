-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: myomeka
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `list_material_specs`
--

DROP TABLE IF EXISTS `list_material_specs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `list_material_specs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class` int DEFAULT NULL,
  `en` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sv` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_MATERIAL_SPECS` (`en`,`sv`),
  KEY `FK_MATERIAL_CLASS` (`class`),
  CONSTRAINT `FK_MATERIAL_CLASS` FOREIGN KEY (`class`) REFERENCES `list_material_class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `list_material_specs`
--

LOCK TABLES `list_material_specs` WRITE;
/*!40000 ALTER TABLE `list_material_specs` DISABLE KEYS */;
INSERT INTO `list_material_specs` VALUES (1,7,'Amphibolite','Amfibolit'),(2,2,'Antlers','Antler'),(3,7,'Basalt','Basalt'),(4,1,'Bronze','Brons'),(5,5,'Copper','Koppar'),(6,7,'Diabase','Diabas'),(7,7,'Flint','Flinta'),(8,5,'Gold','Guld'),(9,7,'Grindstone','Slipsten'),(10,2,'Horn','Horn'),(11,5,'Iron','Järn'),(12,5,'Lead','Bly'),(13,7,'Quartzite','Kvartsit'),(14,7,'Rock','Bergart'),(15,7,'Sandstone','Sandsten'),(16,5,'Silver','Sølv'),(17,7,'Slate','Skiffer'),(18,7,'Soapstone','Täljsten'),(19,5,'White metal','Vitmetall');
/*!40000 ALTER TABLE `list_material_specs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-08 10:52:42
