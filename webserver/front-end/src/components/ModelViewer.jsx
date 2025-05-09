import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { AxesHelper } from 'three'
import Model from './Model'
import '../css/ModelViewer.css'

export default function ModelViewer() {
    const controlsRef = useRef()
    const handleModelLoaded = (center) => {
        if (controlsRef.current) {
            controlsRef.current.target.copy(center)
            controlsRef.current.update()
        }
    }
    return (
        <div className="modelviewer-container">
            <Canvas className="modelviewer-canvas">
                <PerspectiveCamera
                    makeDefault
                    position={[0, 200, 500]}
                    fov={45}
                    near={0.1}
                    far={1000}
                />
                <ambientLight intensity={5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Model
                    modelUrl="../models/Bear.fbx"
                    animationUrl="../models/Bear@idle.fbx"
                    onLoaded={handleModelLoaded}
                />
                <OrbitControls ref={controlsRef} enableZoom={true} enablePan={true} />
                <WorldAxes size={10} />
            </Canvas>
        </div>
    )
}

function WorldAxes({ size = 2 }) {
    const { scene } = useThree()

    useEffect(() => {
        const helper = new AxesHelper(size)
        scene.add(helper)

        return () => {
            scene.remove(helper)
        }
    }, [scene, size])

    return null
}