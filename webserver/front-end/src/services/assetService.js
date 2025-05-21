// 资产、分类、标签 mock 数据与数据获取服务

export function fetchCategories() {
    // TODO: 后续可替换为实际 API 请求
    return Promise.resolve([
        { id: 1, name: '人形动物' },
        { id: 2, name: '机械角色' },
        { id: 3, name: '场景道具' }
    ])
}

export function fetchAssets() {
    // TODO: 后续可替换为实际 API 请求
    return Promise.resolve([
        {
            id: 1,
            name: '棕熊模型',
            categoryId: 1,
            thumbnail: '/thumbnails/bear.jpg',
            tags: ['动物', '熊', '写实'],
            modelUrl: 'Bear.FBX',
            animationUrls: ['Bear Idle.FBX', 'Bear Jump.FBX', 'Bear Misc.FBX']
        },
        {
            id: 2,
            name: '机械战士',
            categoryId: 2,
            thumbnail: '/thumbnails/robot.jpg',
            tags: ['机械', '机器人', '武器'],
            modelUrl: 'Robot.FBX',
            animationUrls: ['Robot Idle.FBX', 'Robot Attack.FBX']
        },
        {
            id: 3,
            name: '森林小屋',
            categoryId: 3,
            thumbnail: '/thumbnails/cabin.jpg',
            tags: ['建筑', '道具'],
            modelUrl: 'Cabin.FBX'
        },
        {
            id: 4,
            name: '可爱猫咪',
            categoryId: 1,
            thumbnail: '/thumbnails/cat.jpg',
            tags: ['动物', '猫', '可爱'],
            modelUrl: 'Cat.FBX',
            animationUrls: ['Cat Idle.FBX', 'Cat Walk.FBX']
        },
        {
            id: 5,
            name: '未来机甲',
            categoryId: 2,
            thumbnail: '/thumbnails/mecha.jpg',
            tags: ['机械', '机器人', '武器'],
            modelUrl: 'Mecha.FBX',
            animationUrls: ['Mecha Idle.FBX', 'Mecha Combat.FBX']
        },
        {
            id: 6,
            name: '中世纪城堡',
            categoryId: 3,
            thumbnail: '/thumbnails/castle.jpg',
            tags: ['建筑', '道具'],
            modelUrl: 'Castle.FBX'
        },
        {
            id: 7,
            name: '卡通兔子',
            categoryId: 1,
            thumbnail: '/thumbnails/rabbit.jpg',
            tags: ['动物', '可爱'],
            modelUrl: 'Rabbit.FBX',
            animationUrls: ['Rabbit Hop.FBX', 'Rabbit Eat.FBX']
        },
        {
            id: 8,
            name: '蒸汽朋克机器人',
            categoryId: 2,
            thumbnail: '/thumbnails/steampunk.jpg',
            tags: ['机械', '机器人'],
            modelUrl: 'Steampunk.FBX',
            animationUrls: ['Steampunk Idle.FBX', 'Steampunk Walk.FBX']
        },
        {
            id: 9,
            name: '魔法水晶',
            categoryId: 3,
            thumbnail: '/thumbnails/crystal.jpg',
            tags: ['道具'],
            modelUrl: 'Crystal.FBX'
        },
        {
            id: 10,
            name: '森林精灵',
            categoryId: 1,
            thumbnail: '/thumbnails/elf.jpg',
            tags: ['人形', '可爱'],
            modelUrl: 'Elf.FBX',
            animationUrls: ['Elf Idle.FBX', 'Elf Dance.FBX']
        },
        {
            id: 11,
            name: '未来战车',
            categoryId: 2,
            thumbnail: '/thumbnails/tank.jpg',
            tags: ['机械', '武器'],
            modelUrl: 'Tank.FBX',
            animationUrls: ['Tank Idle.FBX', 'Tank Move.FBX']
        },
        {
            id: 12,
            name: '古代祭坛',
            categoryId: 3,
            thumbnail: '/thumbnails/altar.jpg',
            tags: ['建筑', '道具'],
            modelUrl: 'Altar.FBX'
        },
        {
            id: 13,
            name: '魔法龙',
            categoryId: 1,
            thumbnail: '/thumbnails/dragon.jpg',
            tags: ['动物', '写实'],
            modelUrl: 'Dragon.FBX',
            animationUrls: ['Dragon Idle.FBX', 'Dragon Fly.FBX', 'Dragon Attack.FBX']
        },
        {
            id: 14,
            name: '智能助手机器人',
            categoryId: 2,
            thumbnail: '/thumbnails/assistant.jpg',
            tags: ['机械', '机器人', '可爱'],
            modelUrl: 'Assistant.FBX',
            animationUrls: ['Assistant Idle.FBX', 'Assistant Work.FBX']
        },
        {
            id: 15,
            name: '魔法传送门',
            categoryId: 3,
            thumbnail: '/thumbnails/portal.jpg',
            tags: ['道具', '建筑'],
            modelUrl: 'Portal.FBX'
        },
        {
            id: 16,
            name: '森林小鹿',
            categoryId: 1,
            thumbnail: '/thumbnails/deer.jpg',
            tags: ['动物', '可爱'],
            modelUrl: 'Deer.FBX',
            animationUrls: ['Deer Idle.FBX', 'Deer Run.FBX']
        },
        {
            id: 17,
            name: '未来无人机',
            categoryId: 2,
            thumbnail: '/thumbnails/drone.jpg',
            tags: ['机械', '武器'],
            modelUrl: 'Drone.FBX',
            animationUrls: ['Drone Hover.FBX', 'Drone Attack.FBX']
        },
        {
            id: 18,
            name: '魔法宝箱',
            categoryId: 3,
            thumbnail: '/thumbnails/chest.jpg',
            tags: ['道具'],
            modelUrl: 'Chest.FBX'
        },
        {
            id: 19,
            name: '森林精灵弓箭手',
            categoryId: 1,
            thumbnail: '/thumbnails/archer.jpg',
            tags: ['人形', '武器'],
            modelUrl: 'Archer.FBX',
            animationUrls: ['Archer Idle.FBX', 'Archer Shoot.FBX']
        },
        {
            id: 20,
            name: '机械蜘蛛',
            categoryId: 2,
            thumbnail: '/thumbnails/spider.jpg',
            tags: ['机械', '机器人'],
            modelUrl: 'Spider.FBX',
            animationUrls: ['Spider Idle.FBX', 'Spider Walk.FBX']
        },
        {
            id: 21,
            name: '魔法喷泉',
            categoryId: 3,
            thumbnail: '/thumbnails/fountain.jpg',
            tags: ['建筑', '道具'],
            modelUrl: 'Fountain.FBX'
        },
        {
            id: 22,
            name: '森林小精灵',
            categoryId: 1,
            thumbnail: '/thumbnails/fairy.jpg',
            tags: ['人形', '可爱'],
            modelUrl: 'Fairy.FBX',
            animationUrls: ['Fairy Idle.FBX', 'Fairy Fly.FBX']
        },
        {
            id: 23,
            name: '未来战甲',
            categoryId: 2,
            thumbnail: '/thumbnails/armor.jpg',
            tags: ['机械', '武器'],
            modelUrl: 'Armor.FBX',
            animationUrls: ['Armor Idle.FBX', 'Armor Combat.FBX']
        },
        {
            id: 24,
            name: '魔法水晶塔',
            categoryId: 3,
            thumbnail: '/thumbnails/crystal_tower.jpg',
            tags: ['建筑', '道具'],
            modelUrl: 'CrystalTower.FBX'
        }
    ])
}

export function fetchTags() {
    // TODO: 后续可替换为实际 API 请求
    return Promise.resolve([
        '动物', '人形', '熊', '猫', '机械', '机器人',
        '武器', '道具', '建筑', '动画', '可爱', '写实'
    ])
} 