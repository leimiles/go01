import '../css/Stats.css'
export default function StatsPanel({ modelStats, showBonesCount }) {
    const stats = {
        vertexAttributes: modelStats.vertexAttributes || {},
        vertices: modelStats.vertices || 0,
        indices: modelStats.indices || 0,
        triangles: modelStats.triangles || 0,
        bones: modelStats.bones || 0,
        submeshes: modelStats.submeshes || 0
    }

    return (
        <div className="model-stats-panel">
            <div className="stats-row">
                <div className="stat-item">
                        Verts:<span className="tilde">~</span>{stats.vertices.toLocaleString()}
                </div>
                <div className="stat-item">
                        Indices:{stats.indices.toLocaleString()}
                </div>
            </div>
            <div className="stats-row">
                <div className="stat-item">
                    Tris:{stats.triangles.toLocaleString()}
                </div>
                <div className="stat-item">
                    Submeshes:{stats.submeshes.toLocaleString()}
                </div>
            </div>

            {/* 分隔线 */}
            <div className="divider" />

            {/* 骨骼数 */}
            {showBonesCount && (
                <>
                    <div className="stats-row">
                        <div className="stat-item">
                            Bones:{stats.bones.toLocaleString()}
                        </div>
                    </div>
                    <div className="divider" />
                </>
            )}

            {/* 顶点属性表格 */}
            <div className="attribute-grid">
                Vertex Attribute
                {Object.entries(stats.vertexAttributes || {}).map(([name, attr]) => (
                    <div key={name} className="attribute-row">
                        <span className="attribute-name">{name}</span>
                        <span className="attribute-type">{attr.type}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}