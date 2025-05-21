import '../css/AssetGrid.css'

function AssetGrid({ assets, selectedAsset, onSelectAsset }) {
    return (
        <div className="asset-grid">
            {assets.map(asset => (
                <div
                    key={asset.id}
                    className={`asset-card ${selectedAsset?.id === asset.id ? 'selected' : ''}`}
                    onClick={() => onSelectAsset(asset)}
                >
                    <div className="asset-thumbnail">
                        <img src={asset.thumbnail} alt={asset.name} />
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