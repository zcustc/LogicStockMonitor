-- MySQL dump 10.13  Distrib 5.7.9, for osx10.9 (x86_64)
--
-- Host: localhost    Database: Data
-- ------------------------------------------------------
-- Server version	5.5.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `realtime_stock_data`
--

DROP TABLE IF EXISTS `realtime_stock_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `realtime_stock_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `volume` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `symbol` varchar(45) NOT NULL,
  `high` decimal(10,0) DEFAULT NULL,
  `low` decimal(10,0) DEFAULT NULL,
  `open` decimal(10,0) DEFAULT NULL,
  `close` decimal(10,0) DEFAULT NULL,
  `pe` decimal(10,0) DEFAULT NULL,
  `eps` decimal(10,0) DEFAULT NULL,
  `peg` decimal(10,0) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realtime_stock_data`
--

LOCK TABLES `realtime_stock_data` WRITE;
/*!40000 ALTER TABLE `realtime_stock_data` DISABLE KEYS */;
INSERT INTO `realtime_stock_data` VALUES (1,1301327,'2016-03-29 02:53:14','GOOG',739,733,737,735,NULL,NULL,NULL,734),(2,1301327,'2016-03-29 02:53:24','GOOG',739,733,737,735,NULL,NULL,NULL,734),(3,1301327,'2016-03-29 02:53:35','GOOG',739,733,737,735,NULL,NULL,NULL,734),(4,1301327,'2016-03-29 02:53:45','GOOG',739,733,737,735,NULL,NULL,NULL,734),(5,1301327,'2016-03-28 20:00:00','GOOG',739,733,737,735,NULL,NULL,NULL,734),(6,1301327,'2016-03-28 20:00:00','GOOG',739,733,737,735,NULL,NULL,NULL,734),(7,1301327,'2016-03-28 20:00:00','GOOG',739,733,737,735,NULL,NULL,NULL,734),(8,1301327,'2016-03-28 20:00:00','GOOG',739,733,737,735,NULL,NULL,NULL,734),(9,0,'2016-03-29 06:44:03','GOOG',113,NULL,13,113,NULL,NULL,NULL,116);
/*!40000 ALTER TABLE `realtime_stock_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-29  9:18:33
