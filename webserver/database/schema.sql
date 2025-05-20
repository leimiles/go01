-- 创建数据库
CREATE DATABASE IF NOT EXISTS assets_3d DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE assets_3d;

-- 分类表（对应父级文件夹）
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '分类名称，如"人形动物"',
    path VARCHAR(255) NOT NULL COMMENT '文件夹路径',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资产分类表';

-- 数据单元表（对应每个资产文件夹）
CREATE TABLE asset_units (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL COMMENT '所属分类ID',
    name VARCHAR(100) NOT NULL COMMENT '数据单元名称，如"小熊"',
    path VARCHAR(255) NOT NULL COMMENT '数据单元文件夹路径',
    thumbnail_path VARCHAR(255) COMMENT '缩略图路径',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE KEY unique_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据单元表';

-- 标签表
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '标签名称，如"动物"、"熊"等',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 数据单元-标签关联表
CREATE TABLE asset_unit_tags (
    asset_unit_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (asset_unit_id, tag_id),
    FOREIGN KEY (asset_unit_id) REFERENCES asset_units(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据单元-标签关联表';

-- 资产文件表（存储数据单元中的具体文件）
CREATE TABLE asset_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_unit_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_type ENUM('model', 'texture', 'animation', 'other') NOT NULL COMMENT '文件类型',
    file_path VARCHAR(255) NOT NULL COMMENT '文件相对路径',
    file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_unit_id) REFERENCES asset_units(id),
    UNIQUE KEY unique_file_path (asset_unit_id, file_path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资产文件表';

-- 创建索引
CREATE INDEX idx_asset_units_category ON asset_units(category_id);
CREATE INDEX idx_asset_files_unit ON asset_files(asset_unit_id);
CREATE INDEX idx_asset_unit_tags_unit ON asset_unit_tags(asset_unit_id);
CREATE INDEX idx_asset_unit_tags_tag ON asset_unit_tags(tag_id); 