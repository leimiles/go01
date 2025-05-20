USE assets_3d;

-- 插入分类数据
INSERT INTO categories (name, path) VALUES
('人形动物', '/assets/humanoid_animals'),
('机械角色', '/assets/mechanical_characters'),
('场景道具', '/assets/scene_props');

-- 插入标签数据
INSERT INTO tags (name) VALUES
('动物'), ('人形'), ('熊'), ('猫'), ('机械'), ('机器人'),
('武器'), ('道具'), ('建筑'), ('动画'), ('可爱'), ('写实');

-- 插入数据单元
INSERT INTO asset_units (category_id, name, path, thumbnail_path) VALUES
(1, '小熊', '/assets/humanoid_animals/bear', '/assets/humanoid_animals/bear/thumbnail.png'),
(1, '猫咪', '/assets/humanoid_animals/cat', '/assets/humanoid_animals/cat/thumbnail.png'),
(2, '战斗机器人', '/assets/mechanical_characters/battle_robot', '/assets/mechanical_characters/battle_robot/thumbnail.png'),
(2, '机械助手', '/assets/mechanical_characters/assistant', '/assets/mechanical_characters/assistant/thumbnail.png'),
(3, '中世纪城堡', '/assets/scene_props/castle', '/assets/scene_props/castle/thumbnail.png'),
(3, '未来武器', '/assets/scene_props/future_weapons', '/assets/scene_props/future_weapons/thumbnail.png');

-- 插入数据单元-标签关联
INSERT INTO asset_unit_tags (asset_unit_id, tag_id) VALUES
-- 小熊的标签
(1, 1), (1, 2), (1, 3), (1, 11),
-- 猫咪的标签
(2, 1), (2, 2), (2, 4), (2, 11),
-- 战斗机器人的标签
(3, 5), (3, 6), (3, 7),
-- 机械助手的标签
(4, 5), (4, 6), (4, 11),
-- 中世纪城堡的标签
(5, 9), (5, 12),
-- 未来武器的标签
(6, 7), (6, 12);

-- 插入资产文件
INSERT INTO asset_files (asset_unit_id, file_name, file_type, file_path, file_size) VALUES
-- 小熊的文件
(1, 'bear.fbx', 'model', '/assets/humanoid_animals/bear/bear.fbx', 1024000),
(1, 'bear.png', 'texture', '/assets/humanoid_animals/bear/bear.png', 512000),
(1, 'bear@idle.fbx', 'animation', '/assets/humanoid_animals/bear/bear@idle.fbx', 256000),
(1, 'bear@walk.fbx', 'animation', '/assets/humanoid_animals/bear/bear@walk.fbx', 256000),
-- 猫咪的文件
(2, 'cat.fbx', 'model', '/assets/humanoid_animals/cat/cat.fbx', 768000),
(2, 'cat.png', 'texture', '/assets/humanoid_animals/cat/cat.png', 384000),
(2, 'cat@idle.fbx', 'animation', '/assets/humanoid_animals/cat/cat@idle.fbx', 192000),
-- 战斗机器人的文件
(3, 'robot.fbx', 'model', '/assets/mechanical_characters/battle_robot/robot.fbx', 2048000),
(3, 'robot.png', 'texture', '/assets/mechanical_characters/battle_robot/robot.png', 1024000),
(3, 'robot@attack.fbx', 'animation', '/assets/mechanical_characters/battle_robot/robot@attack.fbx', 512000),
-- 机械助手的文件
(4, 'assistant.fbx', 'model', '/assets/mechanical_characters/assistant/assistant.fbx', 1536000),
(4, 'assistant.png', 'texture', '/assets/mechanical_characters/assistant/assistant.png', 768000),
-- 中世纪城堡的文件
(5, 'castle.fbx', 'model', '/assets/scene_props/castle/castle.fbx', 4096000),
(5, 'castle.png', 'texture', '/assets/scene_props/castle/castle.png', 2048000),
-- 未来武器的文件
(6, 'weapon.fbx', 'model', '/assets/scene_props/future_weapons/weapon.fbx', 512000),
(6, 'weapon.png', 'texture', '/assets/scene_props/future_weapons/weapon.png', 256000); 