import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { AxesHelper } from 'three'
import Model from '../models/Model'
import RenderModeController from '../controllers/RenderModeController'
import RenderSettingPanel from './RenderSettingPanel'
import AnimationController from '../controllers/AnimationController'
import '../css/ModelViewer.css'

export default function ModelViewer({
    modelUrl = 'Bear.fbx',
    animationUrls = ['Bear@idle.fbx'],
}) {
    const controlsRef = useRef()
    const modelRef = useRef(new Model())
    const groupRef = useRef()
    const renderModeControllerRef = useRef()
    const animationManagerRef = useRef()
    const [isModelReady, setIsModelReady] = useState(false)
    const [renderMode, setRenderMode] = useState('mesh+wireframe')
    const [wireframeColor, setWireframeColor] = useState(null)
    const [showRenderSettings, setShowRenderSettings] = useState(false)
    const [selectedAnimationFile, setSelectedAnimationFile] = useState(animationUrls[0])
    const isLoadedRef = useRef(false)

    // 模型加载
    useEffect(() => {
        const waitForGroup = () => {
            if (!groupRef.current) {
                requestAnimationFrame(waitForGroup)
                return
            }
            if (isLoadedRef.current) return
            isLoadedRef.current = true
            const loadAssets = async () => {
                try {

                    const { model } = await modelRef.current.loadModel(modelUrl)
                    groupRef.current.add(model)

                    // 初始化渲染模式控制器
                    renderModeControllerRef.current = new RenderModeController(model)
                    renderModeControllerRef.current.cacheOriginalMaterials()
                    renderModeControllerRef.current.setRenderMode(renderMode)
                    renderModeControllerRef.current.setWireframeColor(wireframeColor)

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
            renderModeControllerRef.current?.dispose()
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
                console.error("动画加载失败:", err)
            }
        }

        loadAnim()
    }, [selectedAnimationFile, isModelReady])

    // 响应渲染模式变化
    useEffect(() => {
        renderModeControllerRef.current?.setWireframeColor(wireframeColor)
        renderModeControllerRef.current?.setRenderMode(renderMode)
    }, [wireframeColor, renderMode])

    return (
        <div className="modelviewer-container">
            {/* 顶部控制栏 */}
            <div className="top-control-bar">
                <button
                    className="settings-button"
                    onClick={() => setShowRenderSettings(!showRenderSettings)}
                    title="渲染设置"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5zm7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.08-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.61-.25 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z" />
                    </svg>
                </button>
                <div className="spacer"></div>
                <button className="download-button" title="下载">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                </button>
                <button className="close-button">×</button>
            </div>
            {/* 渲染设置侧边栏 */}
            {showRenderSettings && (
                <RenderSettingPanel
                    wireframeColor={wireframeColor}
                    renderMode={renderMode}
                    onColorSelect={(opt) => {
                        setWireframeColor(opt.hex)
                        setRenderMode(renderMode)
                    }}
                    onRenderModeChange={setRenderMode}
                />
            )}
            <Canvas className="modelviewer-canvas">
                <PerspectiveCamera
                    makeDefault
                    position={[0, 200, 500]}
                    fov={45}
                    near={0.1}
                    far={1000}
                />
                <ambientLight intensity={5} />
                <directionalLight position={[-10, -10, 5]} intensity={10} />
                <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]} />
                <OrbitControls
                    ref={controlsRef}
                    enableZoom={true}
                    enablePan={true}
                    target={[0, 50, 0]} />
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