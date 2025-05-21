import { useState, useEffect, lazy, Suspense } from 'react'
import '../css/ContentPage.css'
import CategoryTabs from './CategoryTabs'
import TagFilter from './TagFilter'
import AssetGrid from './AssetGrid'

// 动态导入 ModelViewer
const ModelViewer = lazy(() => import('./ModelViewer'))

function ContentPage() {
    // 状态管理
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedTags, setSelectedTags] = useState([])
    const [allAssets, setAllAssets] = useState([])
    const [filteredAssets, setFilteredAssets] = useState([])
    const [selectedAsset, setSelectedAsset] = useState(null)

    // 获取分类数据
    useEffect(() => {
        // TODO: 从后端获取分类数据
        const mockCategories = [
            { id: 1, name: '人形动物' },
            { id: 2, name: '机械角色' },
            { id: 3, name: '场景道具' }
        ]
        setCategories(mockCategories)
        setSelectedCategory(mockCategories[0])
    }, [])

    // 获取所有资产数据
    useEffect(() => {
        // TODO: 从后端获取资产数据
        const mockAssets = [
            {
                id: 1,
                categoryId: 1,
                name: '小熊',
                thumbnail: '/assets/humanoid_animals/bear/thumbnail.png',
                tags: ['动物', '人形', '熊', '可爱']
            },
            {
                id: 2,
                categoryId: 1,
                name: '猫咪',
                thumbnail: '/assets/humanoid_animals/cat/thumbnail.png',
                tags: ['动物', '人形', '猫', '可爱']
            },
            {
                id: 3,
                categoryId: 2,
                name: '战斗机器人',
                thumbnail: '/assets/mechanical_characters/battle_robot/thumbnail.png',
                tags: ['机械', '机器人', '武器']
            },
            {
                id: 4,
                categoryId: 2,
                name: '机械助手',
                thumbnail: '/assets/mechanical_characters/assistant/thumbnail.png',
                tags: ['机械', '机器人', '可爱']
            },
            {
                id: 5,
                categoryId: 3,
                name: '中世纪城堡',
                thumbnail: '/assets/scene_props/castle/thumbnail.png',
                tags: ['建筑', '写实']
            },
            {
                id: 6,
                categoryId: 3,
                name: '未来武器',
                thumbnail: '/assets/scene_props/future_weapons/thumbnail.png',
                tags: ['武器', '写实']
            }
        ]
        setAllAssets(mockAssets)
    }, [])

    // 根据分类和标签过滤资产
    useEffect(() => {
        if (!selectedCategory) return

        let filtered = allAssets.filter(asset => asset.categoryId === selectedCategory.id)

        if (selectedTags.length > 0) {
            filtered = filtered.filter(asset => 
                selectedTags.every(tag => asset.tags.includes(tag))
            )
        }

        setFilteredAssets(filtered)
        
        // 如果当前选中的资产不在过滤后的列表中，清除选中状态
        if (selectedAsset && !filtered.find(asset => asset.id === selectedAsset.id)) {
            setSelectedAsset(null)
        }
    }, [selectedCategory, selectedTags, allAssets])

    return (
        <div className="content-page">
            <div className="content-header">
                <CategoryTabs 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>
            <div className="content-body">
                <div className="content-sidebar">
                    <TagFilter 
                        selectedTags={selectedTags}
                        onSelectTags={setSelectedTags}
                    />
                </div>
                <div className="content-main">
                    <AssetGrid 
                        assets={filteredAssets}
                        selectedAsset={selectedAsset}
                        onSelectAsset={setSelectedAsset}
                    />
                </div>
                <div className="content-preview">
                    {selectedAsset ? (
                        <Suspense fallback={<div className="preview-placeholder">加载中...</div>}>
                            <ModelViewer asset={selectedAsset} />
                        </Suspense>
                    ) : (
                        <div className="preview-placeholder">
                            请选择一个资产进行预览
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContentPage