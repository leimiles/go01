import { useState, useEffect, lazy, Suspense } from 'react'
import '../css/ContentPage.css'
import CategoryTabs from './CategoryTabs'
import TagFilter from './TagFilter'
import AssetGrid from './AssetGrid'
import { fetchCategories, fetchAssets } from '../services/assetService'
import AssetComments from './AssetComments'

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
        fetchCategories().then(categories => {
            setCategories(categories)
            setSelectedCategory(categories[0])
        })
    }, [])

    // 获取所有资产数据
    useEffect(() => {
        fetchAssets().then(assets => {
            setAllAssets(assets)
        })
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
                        <>
                        <div className="modelviewer-wrapper">
                            <Suspense fallback={<div className="preview-placeholder">加载中...</div>}>
                                <ModelViewer asset={selectedAsset} />
                            </Suspense>
                        </div>
                        <div style={{marginTop: '1.5rem'}}>
                            <AssetComments assetId={selectedAsset.id} />
                        </div>
                        </>
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