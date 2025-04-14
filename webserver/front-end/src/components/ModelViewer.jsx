import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Model from './Model'
import '../css/ModelViewer.css'

export default function ModelViewer() {
    return (
        <div className="modelviewer-container">
            <Canvas className="modelviewer-canvas">
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Model modelUrl="../models/Bear.fbx" animationUrl="../models/Bear@idle.fbx" />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    )
}
