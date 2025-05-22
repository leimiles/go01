-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: assets_3d
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL COMMENT '密码哈希值',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asset_categories`
--

DROP TABLE IF EXISTS `asset_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '分类名称，如"人形动物"',
  `path` varchar(255) NOT NULL COMMENT '文件夹路径',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL COMMENT '父分类ID',
  `sort_order` int DEFAULT '0' COMMENT '排序顺序',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_path` (`path`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `asset_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `asset_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asset_files`
--

DROP TABLE IF EXISTS `asset_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_unit_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL COMMENT '文件名',
  `file_path` varchar(255) NOT NULL COMMENT '文件相对路径',
  `file_size` bigint NOT NULL COMMENT '文件大小(字节)',
  `file_hash` varchar(64) NOT NULL COMMENT '文件哈希值(SHA-256)',
  `hash_algorithm` varchar(20) DEFAULT 'SHA-256' COMMENT '哈希算法',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `file_type_id` int NOT NULL COMMENT '文件类型ID',
  `is_primary` tinyint(1) DEFAULT '0' COMMENT '是否为主要文件',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_file_path` (`asset_unit_id`,`file_path`),
  KEY `idx_asset_files_unit` (`asset_unit_id`),
  KEY `file_type_id` (`file_type_id`),
  CONSTRAINT `asset_files_ibfk_1` FOREIGN KEY (`asset_unit_id`) REFERENCES `asset_units` (`id`),
  CONSTRAINT `asset_files_ibfk_2` FOREIGN KEY (`file_type_id`) REFERENCES `file_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产文件表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asset_unit_tags`
--

DROP TABLE IF EXISTS `asset_unit_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_unit_tags` (
  `asset_unit_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`asset_unit_id`,`tag_id`),
  KEY `idx_asset_unit_tags_unit` (`asset_unit_id`),
  KEY `idx_asset_unit_tags_tag` (`tag_id`),
  CONSTRAINT `asset_unit_tags_ibfk_1` FOREIGN KEY (`asset_unit_id`) REFERENCES `asset_units` (`id`),
  CONSTRAINT `asset_unit_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='数据单元-标签关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asset_units`
--

DROP TABLE IF EXISTS `asset_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_category_id` int NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '数据单元名称，如"小熊"',
  `path` varchar(255) NOT NULL COMMENT '数据单元文件夹路径',
  `thumbnail_path` varchar(255) DEFAULT NULL COMMENT '缩略图路径',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('draft','published','archived') DEFAULT 'draft' COMMENT '资源状态',
  `version` varchar(50) DEFAULT '1.0.0' COMMENT '版本号',
  `version_comment` text COMMENT '版本说明',
  `previous_version_id` int DEFAULT NULL COMMENT '上一个版本ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_path` (`path`),
  KEY `idx_asset_units_category` (`asset_category_id`),
  KEY `idx_asset_units_version` (`previous_version_id`),
  CONSTRAINT `asset_units_ibfk_1` FOREIGN KEY (`asset_category_id`) REFERENCES `asset_categories` (`id`),
  CONSTRAINT `asset_units_ibfk_2` FOREIGN KEY (`previous_version_id`) REFERENCES `asset_units` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='数据单元表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `file_extensions`
--

DROP TABLE IF EXISTS `file_extensions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_extensions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_type_id` int NOT NULL COMMENT '关联的文件类型ID',
  `extension` varchar(20) NOT NULL COMMENT '文件扩展名，如"fbx"、"png"等',
  `description` varchar(255) DEFAULT NULL COMMENT '扩展名描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_type_extension` (`file_type_id`,`extension`),
  CONSTRAINT `file_extensions_ibfk_1` FOREIGN KEY (`file_type_id`) REFERENCES `file_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文件扩展名表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `file_types`
--

DROP TABLE IF EXISTS `file_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '类型名称，如"模型"、"贴图"、"音频"等',
  `description` varchar(255) DEFAULT NULL COMMENT '类型描述',
  `sort_order` int DEFAULT '0' COMMENT '排序顺序',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文件类型表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tag_categories`
--

DROP TABLE IF EXISTS `tag_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '分类名称，如"动物类型"、"风格"等',
  `description` varchar(255) DEFAULT NULL COMMENT '分类描述',
  `sort_order` int DEFAULT '0' COMMENT '排序顺序',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='标签分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tag_merge_history`
--

DROP TABLE IF EXISTS `tag_merge_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag_merge_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source_tag_id` int NOT NULL COMMENT '被合并的标签ID',
  `target_tag_id` int NOT NULL COMMENT '合并后的标签ID',
  `merged_by` int NOT NULL COMMENT '执行合并的管理员ID',
  `merged_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `source_tag_id` (`source_tag_id`),
  KEY `target_tag_id` (`target_tag_id`),
  KEY `merged_by` (`merged_by`),
  CONSTRAINT `tag_merge_history_ibfk_1` FOREIGN KEY (`source_tag_id`) REFERENCES `tags` (`id`),
  CONSTRAINT `tag_merge_history_ibfk_2` FOREIGN KEY (`target_tag_id`) REFERENCES `tags` (`id`),
  CONSTRAINT `tag_merge_history_ibfk_3` FOREIGN KEY (`merged_by`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='标签合并历史表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `tag_usage_stats`
--

DROP TABLE IF EXISTS `tag_usage_stats`;
/*!50001 DROP VIEW IF EXISTS `tag_usage_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `tag_usage_stats` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `tag_category_id`,
 1 AS `usage_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '标签名称，如"动物"、"熊"等',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tag_category_id` int DEFAULT NULL,
  `sort_order` int DEFAULT '0' COMMENT '排序顺序',
  `is_system` tinyint(1) DEFAULT '0' COMMENT '是否为系统标签',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name` (`name`),
  KEY `category_id` (`tag_category_id`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`tag_category_id`) REFERENCES `tag_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='标签表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `tag_usage_stats`
--

/*!50001 DROP VIEW IF EXISTS `tag_usage_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `tag_usage_stats` AS select `t`.`id` AS `id`,`t`.`name` AS `name`,`t`.`tag_category_id` AS `tag_category_id`,count(`aut`.`tag_id`) AS `usage_count` from (`tags` `t` left join `asset_unit_tags` `aut` on((`t`.`id` = `aut`.`tag_id`))) group by `t`.`id`,`t`.`name`,`t`.`tag_category_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-22 13:28:46
