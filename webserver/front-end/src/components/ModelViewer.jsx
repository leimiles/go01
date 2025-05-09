import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { AxesHelper } from 'three'
import Model from '../models/Model'
import AnimationController from '../controllers/AnimationController'
import '../css/ModelViewer.css'

export default function ModelViewer({
    modelUrl = 'Bear.fbx',
    animationUrls = ['Bear@idle.fbx'],
}) {
    const controlsRef = useRef()
    const modelRef = useRef(new Model())
    const groupRef = useRef()
    const animationManagerRef = useRef()
    const [isModelReady, setIsModelReady] = useState(false)
    const [selectedAnimationFile, setSelectedAnimationFile] = useState(animationUrls[0])
    const isLoadedRef = useRef(false)

    // 模型加载
    useEffect(() => {
        const waitForGroup = () => {
            if (!groupRef.current) {
                requestAnimationFrame(waitForGroup)
                return
            }
            if(isLoadedRef.current) return
            isLoadedRef.current = true
            const loadAssets = async () => {
                try {

                    const { model } = await modelRef.current.loadModel(modelUrl )
                    groupRef.current.add(model)

                    // 初始化动画管理器
                    animationManagerRef.current = new AnimationController(model)

                    setIsModelReady(true)
                } catch (err) {
                    isLoadedRef.current = false
                    console.error('加载失败:', err)
                }
            }
            loadAssets()
        }
        waitForGroup()
        return () => {
            animationManagerRef.current?.dispose()
        }
    }, [])

    // 动画加载
    useEffect(() => {
        if (!isModelReady || !selectedAnimationFile) return

        const loadAnim = async () => {
            try {
                const clips = await modelRef.current.loadAnimation(selectedAnimationFile)
                animationManagerRef.current.addAnimations(clips)
                if (clips.length > 0) {
                    animationManagerRef.current.playAnimation(clips[0].name)
                }
            } catch (err) {
                console.error("动画加载失败:", err);
            }
        }

        loadAnim()
    }, [selectedAnimationFile, isModelReady])

    return (
        <div className="modelviewer-container">

            <Canvas className="modelviewer-canvas">
                <ambientLight intensity={5} />
                <directionalLight position={[-10, -10, 5]} intensity={10} />
                <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]} />
                <OrbitControls ref={controlsRef} enableZoom={true} enablePan={true} />
                <WorldAxes size={10} />
                {isModelReady && (
                    <FrameSync
                        animationManagerRef={animationManagerRef}
                    />
                )}
            </Canvas>
        </div>
    )
}

function FrameSync({ animationManagerRef }) {
    useFrame((_, delta) => {
        if (animationManagerRef.current?.currentAction) {
            animationManagerRef.current.update(delta)
        }
    })
    return null
}


function WorldAxes({ size = 2 }) {
    const { scene } = useThree()
    useEffect(() => {
        const helper = new AxesHelper(size)
        scene.add(helper)
        return () => scene.remove(helper)
    }, [scene, size])
    return null
}