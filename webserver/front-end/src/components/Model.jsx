import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'
import { AnimationMixer } from 'three'
import { MeshStandardMaterial } from 'three'
import * as THREE from 'three'

export default function Model({ modelUrl, animationUrl, rotation = [0, 0, 0] }) {
    const group = useRef()
    const mixer = useRef()
    const modelRoot = useRef()

    // 轨道路径自动修正
    const fixAnimationTrackPaths = (clip, model) => {
        const existingNames = new Set()
        model.traverse(obj => {
            if (obj.name) existingNames.add(obj.name)
        })

        clip.tracks.forEach(track => {
            const [originalTarget] = track.name.split('.')
            if (!existingNames.has(originalTarget)) {
                const fallbackTarget = model.name || 'Root'
                console.warn(`🚨 替换轨道路径: ${track.name} → ${track.name.replace(originalTarget, fallbackTarget)}`)
                track.name = track.name.replace(originalTarget, fallbackTarget)
            }
        })

        return clip
    }

    useEffect(() => {
        const loader = new FBXLoader()
        loader.setPath('/models/')
        loader.manager.addHandler(/\.tga$/i, new TGALoader())

        // Step 1: 加载模型
        loader.load(modelUrl, (object) => {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new MeshStandardMaterial({ color: 'white' })
                }
            })

            object.rotation.set(...rotation)
            group.current.add(object)
            modelRoot.current = object
        }, undefined, (error) => {
            console.error("模型加载失败：", error)
        })

        // Step 2: 加载动画（并尝试路径修正）
        if (animationUrl) {
            loader.load(animationUrl, (animObject) => {
                if (!modelRoot.current) return

                const clips = animObject.animations
                if (clips.length > 0) {
                    mixer.current = new AnimationMixer(modelRoot.current)
                    const fixedClip = fixAnimationTrackPaths(clips[0].clone(), modelRoot.current)
                    const action = mixer.current.clipAction(fixedClip)
                    action.play()
                }
            }, undefined, (error) => {
                console.error("动画加载失败：", error)
            })
        }

        return () => {
            if (mixer.current) mixer.current.stopAllAction()
        }
    }, [modelUrl, animationUrl, rotation])

    useFrame((_, delta) => {
        if (mixer.current) mixer.current.update(delta)
    })

    return (
        <group ref={group} position={[0, -1, 0]} scale={[0.01, 0.01, 0.01]} />
    )
}
