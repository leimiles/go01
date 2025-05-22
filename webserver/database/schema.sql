-- 创建数据库
CREATE DATABASE IF NOT EXISTS assets_3d DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE assets_3d;

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希值',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    last_login_at TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
    UNIQUE KEY username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 资源分类表，对应资源分类文件夹
CREATE TABLE IF NOT EXISTS asset_categories (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    path VARCHAR(255) NOT NULL COMMENT '分类路径',
    parent_id INT DEFAULT NULL COMMENT '父分类ID',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY unique_path (path),
    FOREIGN KEY (parent_id) REFERENCES asset_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源分类表';

-- 资源单元表
CREATE TABLE IF NOT EXISTS asset_units (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '资源单元ID',
    name VARCHAR(100) NOT NULL COMMENT '资源名称',
    path VARCHAR(255) NOT NULL COMMENT '资源路径',
    asset_category_id INT NOT NULL COMMENT '所属分类ID',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT '状态',
    version VARCHAR(50) DEFAULT '1.0.0' COMMENT '版本号',
    version_comment TEXT COMMENT '版本说明',
    previous_version_id INT DEFAULT NULL COMMENT '上一个版本ID',
    thumbnail_path VARCHAR(255) DEFAULT NULL COMMENT '缩略图路径',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY unique_path (path),
    FOREIGN KEY (asset_category_id) REFERENCES asset_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (previous_version_id) REFERENCES asset_units(id) ON DELETE SET NULL,
    INDEX idx_asset_units_version (previous_version_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源单元表';

-- 文件类型表
CREATE TABLE IF NOT EXISTS file_types (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '文件类型ID',
    name VARCHAR(50) NOT NULL COMMENT '类型名称',
    description TEXT COMMENT '类型描述',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件类型表';

-- 文件扩展名表
CREATE TABLE IF NOT EXISTS file_extensions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '扩展名ID',
    file_type_id INT NOT NULL COMMENT '文件类型ID',
    extension VARCHAR(20) NOT NULL COMMENT '文件扩展名',
    description TEXT COMMENT '扩展名描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY unique_type_extension (file_type_id, extension),
    FOREIGN KEY (file_type_id) REFERENCES file_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件扩展名表';

-- 资源文件表
CREATE TABLE IF NOT EXISTS asset_files (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '文件ID',
    asset_unit_id INT NOT NULL COMMENT '所属资源单元ID',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_path VARCHAR(255) NOT NULL COMMENT '文件路径',
    file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
    file_hash VARCHAR(64) NOT NULL COMMENT '文件哈希值(SHA-256)',
    hash_algorithm VARCHAR(20) DEFAULT 'SHA-256' COMMENT '哈希算法',
    file_type_id INT NOT NULL COMMENT '文件类型ID',
    is_primary BOOLEAN DEFAULT FALSE COMMENT '是否主文件',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY unique_file_path (asset_unit_id, file_path),
    FOREIGN KEY (asset_unit_id) REFERENCES asset_units(id) ON DELETE CASCADE,
    FOREIGN KEY (file_type_id) REFERENCES file_types(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源文件表';

-- 标签分类表
CREATE TABLE IF NOT EXISTS tag_categories (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '标签分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签分类表';

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '标签ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    tag_category_id INT DEFAULT NULL COMMENT '标签分类ID',
    description TEXT COMMENT '标签描述',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    is_system BOOLEAN DEFAULT FALSE COMMENT '是否系统标签',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY unique_name (name),
    FOREIGN KEY (tag_category_id) REFERENCES tag_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 资源-标签关联表
CREATE TABLE IF NOT EXISTS asset_unit_tags (
    asset_unit_id INT NOT NULL COMMENT '资源单元ID',
    tag_id INT NOT NULL COMMENT '标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (asset_unit_id, tag_id),
    INDEX idx_asset_unit_tags_unit (asset_unit_id),
    INDEX idx_asset_unit_tags_tag (tag_id),
    FOREIGN KEY (asset_unit_id) REFERENCES asset_units(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源-标签关联表';

-- 标签合并历史表
CREATE TABLE IF NOT EXISTS tag_merge_history (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '合并记录ID',
    source_tag_id INT NOT NULL COMMENT '源标签ID',
    target_tag_id INT NOT NULL COMMENT '目标标签ID',
    merged_by INT NOT NULL COMMENT '执行合并的管理员ID',
    merged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '合并时间',
    FOREIGN KEY (source_tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    FOREIGN KEY (target_tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    FOREIGN KEY (merged_by) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签合并历史表';

-- 标签使用统计视图
CREATE OR REPLACE VIEW tag_usage_stats AS
SELECT 
    t.id,
    t.name,
    t.tag_category_id,
    tc.name as category_name,
    COUNT(aut.tag_id) as usage_count
FROM tags t
LEFT JOIN tag_categories tc ON t.tag_category_id = tc.id
LEFT JOIN asset_unit_tags aut ON t.id = aut.tag_id
GROUP BY t.id, t.name, t.tag_category_id, tc.name; 