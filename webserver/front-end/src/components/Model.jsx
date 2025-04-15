import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'
import { AnimationMixer } from 'three'
import { MeshStandardMaterial } from 'three'
import { BoxHelper } from 'three'

import * as THREE from 'three'

export default function Model({ modelUrl, animationUrl, onLoaded }) {
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
                    //child.material = new MeshStandardMaterial({ color: 'white' })
                    console.log('child:', child.name)
                    console.log('child material:', child.material.name)
                }
            })

            // console.log('root rotation:', object.rotation)
            // console.log('position:', object.position)
            // console.log('up:', object.up)  // 默认是 Y 向上

            const { box, size, center } = analyzeBoundingBox(object)
            group.current.add(object)

            const helper = new BoxHelper(object, 0xffff00)
            group.current.add(helper)

            modelRoot.current = object

            //通知外部（ModelViewer）中心点
            //onLoaded?.(center)
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
    }, [modelUrl, animationUrl])

    useFrame((_, delta) => {
        if (mixer.current) mixer.current.update(delta)
    })

    return (
        <group ref={group} position={[0, 0, 0]} scale={[1, 1, 1]} />
    )
}

function analyzeBoundingBox(object3d) {
    const box = new THREE.Box3().setFromObject(object3d)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    return { box, size, center }
}