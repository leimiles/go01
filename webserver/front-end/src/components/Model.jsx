import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AnimationMixer } from 'three'
import * as THREE from 'three'

export default function Model({ modelUrl, animationUrl }) {
    const group = useRef()
    const mixer = useRef()
    const meshRef = useRef()

    useEffect(() => {
        const loader = new FBXLoader()

        loader.load(modelUrl, (object) => {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: 'white' })
                    meshRef.current = child
                }
            })
            group.current.add(object)
        })

        if (animationUrl) {
            loader.load(animationUrl, (animObject) => {
                if (meshRef.current) {
                    mixer.current = new AnimationMixer(meshRef.current)
                    if (animObject.animations.length > 0) {
                        const action = mixer.current.clipAction(animObject.animations[0])
                        action.play()
                    }
                }
            })
        }
    }, [modelUrl, animationUrl])

    useFrame((state, delta) => {
        if (mixer.current) mixer.current.update(delta)
    })

    return <group ref={group} position={[0, -1, 0]} scale={[0.01, 0.01, 0.01]} />
}
