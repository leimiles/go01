import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';

import * as THREE from 'three'

export default class Model {
    constructor() {
        this.modelRoot = null
    }

    // 根据文件扩展名选择加载器
    getLoader(url) {
        const ext = url.split('.').pop().toLowerCase()
        switch (ext) {
            case 'fbx':
                return FBXLoader
            default:
                throw new Error(`Unsupported format: ${ext}`)
        }
    }

    // 加载模型
    async loadModel(url) {
        const ext = url.split('.').pop().toLowerCase()
        const loaderClass = this.getLoader(url)
        const loader = new loaderClass()
        loader.setPath('/models/')
        loader.manager.addHandler(/\.tga$/i, new TGALoader())
        return new Promise((resolve, reject) => {
            loader.load(url, (object) => {
                // 如果是 Z-up 模型，则矫正旋转值
                this.fixModelRotation(object)
                // 如果没有贴图或材质就给一个默认的灰色材质
                this.fixMaterials(object)
                this.modelRoot = object
                resolve({
                    model: object,
                    animations: object.animations || []
                })
            }, undefined, reject)
        })
    }

    // 加载动画
    async loadAnimation(url) {
        const loader = new FBXLoader()
        loader.setPath('/models/')
        return new Promise((resolve, reject) => {
            loader.load(url, (animData) => {
                const clips = animData.animations || []
                resolve(clips)
            }, undefined, reject)
        })
    }

    // 对 Z-up 模型进行旋转矫正
    fixModelRotation(object) {
        // 寻找根骨骼
        let rootBone = null
        object.traverse(child => {
            if (child.isBone && !child.parent?.isBone) {
                rootBone = child
            }
        })

        // 如果存在根骨骼且Z轴旋转90度
        if (rootBone) {
            const worldEuler = new THREE.Euler().setFromQuaternion(
                rootBone.getWorldQuaternion(new THREE.Quaternion())
            )
            const zDeg = Math.abs(THREE.MathUtils.radToDeg(worldEuler.z))
            if (Math.abs(zDeg - 90) < 1) {
                object.rotation.set(-Math.PI / 2, 0, 0)
                object.updateMatrixWorld(true);
            }
        }
    }

    // 修复材质
    fixMaterials(object) {
        object.traverse(child => {
            if (child.isMesh) {
                if (child.material) {
                    const materials = Array.isArray(child.material)
                        ? child.material
                        : [child.material]

                    materials.forEach(mat => {
                        // 检查贴图是否加载失败，如果没有贴图则设置为默认灰色材质
                        if (!mat.map?.image) {
                            child.material = new THREE.MeshStandardMaterial({
                                color: 0x888888,
                                roughness: 0.7,
                                metalness: 0.1
                            })

                        }
                    })
                } else {
                    // 无材质时也设置为默认灰色材质
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,
                        roughness: 0.7,
                        metalness: 0.1
                    })
                }
            }
        })
    }

}