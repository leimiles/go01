import { useState } from 'react'
import '../css/AssetGrid.css'

function AssetGrid({ assets, selectedAsset, onSelectAsset }) {
    // 用对象存储每个 asset 的图片加载失败状态
    const [imgErrorMap, setImgErrorMap] = useState({})

    // 图片加载失败时的处理
    const handleImgError = (id) => {
        setImgErrorMap(prev => ({ ...prev, [id]: true }))
    }

    return (
        <div className="asset-grid">
            {assets.map(asset => (
                <div
                    key={asset.id}
                    className={`asset-card ${selectedAsset?.id === asset.id ? 'selected' : ''}`}
                    onClick={() => onSelectAsset(asset)}
                >
                    <div className="asset-thumbnail">
                        {!imgErrorMap[asset.id] ? (
                            <img src={asset.thumbnail} onError={() => handleImgError(asset.id)} />
                        ) : (
                            <span className="img-error-text">图片加载失败</span>
                        )}
                    </div>
                    <div className="asset-info">
                        <h3>{asset.name}</h3>
                        <div className="asset-tags">
                            {asset.tags.map(tag => (
                                <span key={tag} className="asset-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AssetGrid 