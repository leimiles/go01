import '../css/Stats.css'
export default function StatsPanel({ modelStats, showBonesCount }) {
    return (
        <div className="model-stats-panel">
            <div>顶点数: {modelStats.vertices.toLocaleString()}</div>
            <div>三角面数: {modelStats.triangles.toLocaleString()}</div>
            {showBonesCount && <div>骨骼数: {modelStats.bones.toLocaleString()}</div>}
        </div>
    )
}