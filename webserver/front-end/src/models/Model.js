import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'

import * as THREE from 'three'

export default class Model {
    constructor() {
        this.modelRoot = null
        this.initLoaderDefaults()
    }

    // 路径/TGA处理器
    initLoaderDefaults() {
        this.loaderSettings = {
            path: '/models/',
            tgaHandler: new TGALoader()
        }
    }

    // 根据扩展名选择加载器
    getLoader(ext) {
        switch (ext) {
            case 'fbx': return FBXLoader
            case 'obj': return OBJLoader
            default: throw new Error(`Unsupported format: ${ext}`)
        }
    }

    // 统一模型加载入口
    async loadModel(url) {
        const ext = url.split('.').pop().toLowerCase()

        // OBJ特殊处理（需加载MTL）
        if (ext === 'obj') {
            const materials = await this.loadMTL(url)
            return await this.loadWithObjLoader(url, materials)
        }

        // FBX加载
        if (ext === 'fbx') {
            return this.loadWithFbxLoader(url)
        }
    }

    // 加载MTL
    async loadMTL(objUrl) {
        const mtlUrl = objUrl.replace('.obj', '.mtl')
        const mtlLoader = new MTLLoader()
        mtlLoader.setPath(this.loaderSettings.path)
        mtlLoader.manager.addHandler(/\.tga$/i, this.loaderSettings.tgaHandler)

        const materials = await new Promise((resolve, reject) => {
            mtlLoader.load(mtlUrl, resolve, undefined, reject)
        })
        materials.preload()
        return materials
    }

    // OBJ加载（带MTL材质）
    async loadWithObjLoader(url, materials) {
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.setPath(this.loaderSettings.path)

        const object = await new Promise((resolve, reject) => {
            objLoader.load(url, resolve, undefined, reject)
        })

        this.postProcessModel(object)
        return { model: object }
    }

    // FBX加载
    async loadWithFbxLoader(url) {
        const fbxLoader = new FBXLoader()
        fbxLoader.setPath(this.loaderSettings.path)
        fbxLoader.manager.addHandler(/\.tga$/i, this.loaderSettings.tgaHandler)
        const object = await new Promise((resolve, reject) => {
            fbxLoader.load(url, resolve, undefined, reject)
        })

        this.postProcessModel(object)
        return { model: object }
    }

    // 后处理模型
    postProcessModel(object) {
        // 如果是 Z-up 模型，则矫正旋转值
        this.fixModelRotation(object)
        // 如果没有贴图或材质就给一个默认的灰色材质
        this.fixMaterials(object)
        this.modelRoot = object
    }

    // 加载动画
    async loadAnimation(url) {
        const loader = new FBXLoader()
        loader.setPath(this.loaderSettings.path)
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
                object.updateMatrixWorld(true)
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