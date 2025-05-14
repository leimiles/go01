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
        this.stats = {
            vertices: 0,
            triangles: 0,
            bones: 0
        }
    }

    // 路径/TGA处理器
    initLoaderDefaults() {
        this.loaderSettings = {
            path: '/models/',
            tgaHandler: new TGALoader()
        }
    }

    // 统一模型加载入口
    async loadModel(url) {
        const ext = url.split('.').pop().toLowerCase()
        this.resetStats()

        try {
            let result
            if (ext === 'fbx') {
                result = await this.loadWithFbxLoader(url)
            } else if (ext === 'obj') {
                const materials = await this.loadMTL(url)
                result = await this.loadWithObjLoader(url, materials)
            } else if (ext === 'gltf' || ext === 'glb') {
                result = await this.loadWithGLTFLoader(url)
            } else {
                throw new Error(`Unsupported format: ${ext}`)
            }

            // 返回模型和统计信息
            return {
                model: result.model,
                stats: this.stats
            }
        } catch (error) {
            console.error('Failed to load model:', error)
            throw error
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

    // GLTF/GLB加载
    async loadWithGLTFLoader(url) {
        const gltfLoader = new GLTFLoader()
        gltfLoader.setPath(this.loaderSettings.path)
        const gltf = await new Promise((resolve, reject) => {
            gltfLoader.load(url, resolve, undefined, reject)
        })
        this.postProcessModel(gltf.scene)
        return { model: gltf.scene }
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
        // 统计模型数据
        this.calculateStats(object)
        // 如果是 Z-up 模型，则矫正旋转值
        this.fixModelRotation(object)
        // 如果没有贴图或材质就给一个默认的灰色材质
        this.fixMaterials(object)
        this.modelRoot = object
    }

    // 加载GLTF/GLB动画
    async loadGLTFAnimation(url) {
        const gltfLoader = new GLTFLoader()
        gltfLoader.setPath(this.loaderSettings.path)
        const gltf = await new Promise((resolve, reject) => {
            gltfLoader.load(url, resolve, undefined, reject)
        })

        return gltf.animations || []
    }

    // 加载动画
    async loadAnimation(url) {
        const ext = url.split('.').pop().toLowerCase()
        if (ext === 'gltf' || ext === 'glb') {
            return this.loadGLTFAnimation(url)
        }
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
    // 重置统计
    resetStats() {
        this.stats = {
            vertices: 0,
            triangles: 0,
            bones: 0
        }
    }

    // 计算模型统计信息
    calculateStats(object) {
        object.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const geometry = child.geometry

                // 统计顶点数
                if (geometry.attributes.position) {
                    this.stats.vertices += geometry.attributes.position.count
                }

                // 统计三角面数
                if (geometry.index) {
                    this.stats.triangles += geometry.index.count / 3
                } else {
                    this.stats.triangles += geometry.attributes.position.count / 3
                }
            }

            if (child.isBone) {
                this.stats.bones++
            }
        })

    }
}