import '../css/RenderMode.css'
const colorOptions = [
    { id: 'none', hex: null },
    { id: 'black', hex: 0x000001 },
    { id: 'gray', hex: 0xffffff },
    { id: 'red', hex: 0xff0000 },
    { id: 'blue', hex: 0x0000ff },
    { id: 'green', hex: 0x00ff00 }
]

export default function RenderSettingPanel({
    wireframeColor,
    renderMode,
    showSkeletonOption,
    skeletonVisible,
    modelVisible,
    onColorSelect,
    onRenderModeChange,
    onSkeletonVisibleChange,
    onModelVisibleChange
}) {

    return (
        <div className="render-sidebar">
            <div className="sidebar-title">渲染设置</div>
            <div className="section-title">线框</div>
            <div className="color-options">
                {colorOptions.map(opt => (
                    <div
                        key={opt.id}
                        className={`color-option ${wireframeColor === opt.hex ? 'selected' : ''}`}
                        onClick={() => onColorSelect(opt)}>
                        <div className={`color-box ${opt.id}`}>
                            {opt.id === 'none' && (
                                <div className="no-wireframe-icon"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <label className="checkbox-option">
                <input
                    type="checkbox"
                    checked={renderMode === 'wireframe'}
                    onChange={(e) => onRenderModeChange(e.target.checked ? 'wireframe' : 'mesh+wireframe')}
                />
                仅线框
            </label>
            {/* 只在有动画时显示骨骼选项 */}
            {showSkeletonOption && (
                <>
                    <div className="section-title">骨骼</div>
                    <label className="checkbox-option">
                        <input
                            type="checkbox"
                            checked={skeletonVisible}
                            onChange={(e) => onSkeletonVisibleChange(e.target.checked)}
                        />
                        显示骨骼
                    </label>
                    <label className="checkbox-option">
                        <input
                            type="checkbox"
                            checked={modelVisible}
                            onChange={(e) => onModelVisibleChange(e.target.checked)}
                        />
                        显示模型
                    </label>
                </>
            )}
        </div>
    )
}