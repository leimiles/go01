import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { AxesHelper } from 'three'
import Model from '../models/Model'
import RenderModeController from '../controllers/RenderModeController'
import RenderSettingPanel from './RenderSettingPanel'
import AnimationController from '../controllers/AnimationController'
import AnimationControlPanel from './AnimationControlPanel'
import StatPanel from './StatsPanel'
import '../css/ModelViewer.css'

import * as THREE from 'three'

export default function ModelViewer({
    modelUrl = 'Bear.fbx',
    animationUrls = ['Bear@idle.fbx', 'Bear Jump.FBX', 'Bear Misc.FBX'],
}) {
    const controlsRef = useRef()
    const cameraRef = useRef()
    const modelRef = useRef(new Model())
    const groupRef = useRef()
    const renderModeControllerRef = useRef()
    const animationManagerRef = useRef()
    const [isModelReady, setIsModelReady] = useState(false)
    const [skeletonVisible, setSkeletonVisible] = useState(false)
    const [modelVisible, setModelVisible] = useState(true)
    const [renderMode, setRenderMode] = useState('mesh+wireframe')
    const [wireframeColor, setWireframeColor] = useState(null)
    const [showRenderSettings, setShowRenderSettings] = useState(false)
    const [modelStats, setModelStats] = useState({ vertices: 0, triangles: 0, bones: 0 })
    const [selectedAnimationFile, setSelectedAnimationFile] = useState(animationUrls[0])
    const [duration, setDuration] = useState(1)
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const wasPlayingRef = useRef(true)
    const isLoadedRef = useRef(false)

    // 计算摄像机距离
    const calculateCameraSettings = (model) => {
        const box = modelRef.current.getBoundingBox(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const cameraDistance = maxDim * 2
        const yOffset = size.y * 0.2

        return {
            position: new THREE.Vector3(
                center.x,
                center.y + yOffset,
                cameraDistance
            ),
            target: new THREE.Vector3(
                center.x,
                center.y - yOffset,
                center.z
            )
        }
    }
    // 应用摄像机和控制器的设置
    const applyCameraSettings = (settings) => {
        cameraRef.current.position.copy(settings.position)
        cameraRef.current.lookAt(settings.target)
        controlsRef.current.target.copy(settings.target)
        controlsRef.current.update()
    }

    // 重置视图
    const resetView = () => {
        if (controlsRef.current && cameraRef.current && modelRef.current.modelRoot) {
            const cameraSettings = calculateCameraSettings(modelRef.current.modelRoot)
            applyCameraSettings(cameraSettings)
        }
    }

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

                    const { model, stats } = await modelRef.current.loadModel(modelUrl)
                    groupRef.current.add(model)

                    const cameraSettings = calculateCameraSettings(model)
                    applyCameraSettings(cameraSettings)

                    setModelStats(stats)

                    // 初始化渲染模式控制器
                    renderModeControllerRef.current = new RenderModeController(model)
                    renderModeControllerRef.current.cacheOriginalMaterials()
                    renderModeControllerRef.current.setRenderMode(renderMode)
                    renderModeControllerRef.current.setWireframeColor(wireframeColor)
                    renderModeControllerRef.current.setSkeletonVisible(skeletonVisible)
                    renderModeControllerRef.current.setModelVisible(modelVisible)

                    // 初始化动画管理器
                    animationManagerRef.current = new AnimationController(model, setDuration)

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

    // 显示骨骼
    useEffect(() => {
        renderModeControllerRef.current?.setSkeletonVisible(skeletonVisible)
    }, [skeletonVisible])

    // 显示模型
    useEffect(() => {
        renderModeControllerRef.current?.setModelVisible(modelVisible)
    }, [modelVisible])

    // 响应动画进度变化
    useEffect(() => {
        if (animationManagerRef.current) {
            animationManagerRef.current.setTime(progress)
        }
    }, [progress])

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
                <button
                    className="reset-view-button"
                    onClick={resetView}
                    title="重置视图"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
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
                    skeletonVisible={skeletonVisible}
                    modelVisible={modelVisible}
                    onColorSelect={(opt) => {
                        setWireframeColor(opt.hex)
                        setRenderMode(renderMode)
                    }}
                    onRenderModeChange={setRenderMode}
                    onSkeletonVisibleChange={setSkeletonVisible}
                    onModelVisibleChange={setModelVisible}
                />
            )}
            {/* 数据显示 */}
            <StatPanel modelStats={modelStats} />
            {/* 动画播放栏 */}
            <AnimationControlPanel
                animationFiles={animationUrls}
                selectedAnimationFile={selectedAnimationFile}
                isPlaying={isPlaying}
                progress={progress}
                duration={duration}
                onAnimationSelect={setSelectedAnimationFile}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onProgressChange={setProgress}
                onProgressDragStart={() => {
                    wasPlayingRef.current = isPlaying
                    setIsPlaying(false)
                }}
                onProgressDragEnd={() => {
                    if (wasPlayingRef.current) setIsPlaying(true)
                }}
            />
            <Canvas className="modelviewer-canvas">
                <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
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
                    enablePan={true} />
                <WorldAxes size={10} />
                {isModelReady && (
                    <FrameSync
                        animationManagerRef={animationManagerRef}
                        isPlaying={isPlaying}
                        setProgress={setProgress}
                    />
                )}
            </Canvas>
        </div>
    )
}

function FrameSync({ animationManagerRef, isPlaying, setProgress }) {
    useFrame((_, delta) => {
        if (animationManagerRef.current?.currentAction && isPlaying) {
            animationManagerRef.current.update(delta)
            const action = animationManagerRef.current.currentAction
            setProgress(Math.min(action.time, action.getClip().duration))
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