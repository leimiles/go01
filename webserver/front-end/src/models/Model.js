import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'

import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'

import * as THREE from 'three'

export default class Model {
    constructor(animationUrls = []) {
        this.modelRoot = null
        this.initLoaderDefaults()
        this.stats = {
            vertexAttributes: {},
            vertices: 0,
            indices: 0,
            triangles: 0,
            bones: 0,
            submeshes: 0
        }
        this.animationUrls = animationUrls
        this.isLoadingAnimationAsModel = false
    }

    // 路径/TGA处理器
    initLoaderDefaults() {
        this.loaderSettings = {
            basePath: '',
            texturePath: 'textures/',
            animationPath: 'animations/',
            tgaHandler: new TGALoader()
        }
    }

    setBasePath(path) {
        this.loaderSettings.basePath = path.endsWith('/') ? path : path + '/'
    }

    getTexturePath() {
        return `${this.loaderSettings.basePath}${this.loaderSettings.texturePath}`
    }

    getAnimationPath() {
        return `${this.loaderSettings.basePath}${this.loaderSettings.animationPath}`
    }

    // 统一模型加载入口
    async loadModel(url) {
        const ext = url.split('.').pop().toLowerCase()
        this.resetStats()

        try {
            let result
            if (ext === 'fbx') {
                result = await this.loadWithFbxLoader(url, this.isLoadingAnimationAsModel)
            } else if (ext === 'obj') {
                const materials = await this.loadMTL(url)
                result = await this.loadWithObjLoader(url, materials)
            } else if (ext === 'gltf' || ext === 'glb') {
                result = await this.loadWithGLTFLoader(url, this.isLoadingAnimationAsModel)
            } else if (ext === '') {
                this.isLoadingAnimationAsModel = true
                console.log(this.animationUrls[0])
                return this.loadModel(this.animationUrls[0])
            } else {
                throw new Error(`Unsupported format: ${ext}`)
            }
            const hasBones = this.calculateStats(result.model)
            this.postProcessModel(result.model)
            // 返回模型和统计信息
            return {
                model: result.model,
                stats: this.stats,
                hasBones
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
        mtlLoader.setPath(this.getTexturePath)
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
        objLoader.setPath(this.loaderSettings.basePath)

        const object = await new Promise((resolve, reject) => {
            objLoader.load(url, resolve, undefined, reject)
        })
        return { model: object }
    }

    // GLTF/GLB加载
    async loadWithGLTFLoader(url, isAnimation = false) {
        const gltfLoader = new GLTFLoader()
        if (isAnimation) {
            gltfLoader.setPath(this.getAnimationPath())
        }
        else {
            gltfLoader.setPath(this.loaderSettings.basePath)
            console.log(this.loaderSettings.basePath)
        }
        const gltf = await new Promise((resolve, reject) => {
            gltfLoader.load(url, resolve, undefined, reject)
        })
        return { model: gltf.scene }
    }

    // FBX加载
    async loadWithFbxLoader(url, isAnimation = false) {
        const fbxLoader = new FBXLoader()
        if (isAnimation) {
            fbxLoader.setPath(this.getAnimationPath())
        }
        else {
            fbxLoader.setPath(this.loaderSettings.basePath)
        }
        fbxLoader.setResourcePath(this.getTexturePath())
        fbxLoader.manager.addHandler(/\.tga$/i, this.loaderSettings.tgaHandler)
        const object = await new Promise((resolve, reject) => {
            fbxLoader.load(url, resolve, undefined, reject)
        })
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

    async loadAnimation(url) {
        const ext = url.split('.').pop().toLowerCase()

        try {
            if (ext === 'gltf' || ext === 'glb') {
                const gltfLoader = new GLTFLoader()
                gltfLoader.setPath(this.getAnimationPath())
                const gltf = await new Promise((resolve, reject) => {
                    gltfLoader.load(url, resolve, undefined, reject)
                })
                return gltf.animations || []
            } else {
                const loader = new FBXLoader()
                loader.setPath(this.getAnimationPath())
                loader.setResourcePath(this.getTexturePath())
                loader.manager.addHandler(/\.tga$/i, this.loaderSettings.tgaHandler)
                return new Promise((resolve, reject) => {
                    loader.load(url, (animData) => {
                        resolve(animData.animations || [])
                    }, undefined, reject)
                })
            }
        } catch (error) {
            throw new Error(`动画加载失败: ${error.message}`)
        }
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
            vertexAttributes: {},
            vertices: 0,
            triangles: 0,
            bones: 0
        }
    }

    // 计算模型统计信息
    calculateStats(object) {
        const stats = {
            vertexAttributes: {},
            vertices: 0,
            indices: 0,
            triangles: 0,
            bones: 0,
            submeshes: 0
        }
        let hasBones = false
        object.traverse((child) => {
            if (child.isMesh && child.geometry) {
                let geometry = child.geometry
                if (!child.geometry.index) {
                    const merged = mergeVertices(child.geometry)
                    merged.computeTangents()
                    geometry = merged
                }

                for (const [name, attr] of Object.entries(geometry.attributes)) {
                    if (!stats.vertexAttributes[name]) {
                        const type = attr.array.constructor.name.replace('Array', '')
                        const bytesPerElement = attr.array.BYTES_PER_ELEMENT
                        const bytesTotal = attr.itemSize * bytesPerElement

                        stats.vertexAttributes[name] = {
                            type: `${type}x${attr.itemSize}(${bytesTotal}bytes)`,
                        }
                    }
                }

                // 统计顶点数
                if (geometry.attributes.position) {
                    stats.vertices += geometry.attributes.position.count
                }

                // 统计索引数
                if (geometry.index) {
                    stats.indices += geometry.index.count
                }

                // 统计三角面数
                if (geometry.index) {
                    stats.triangles += geometry.index.count / 3
                } else {
                    stats.triangles += geometry.attributes.position.count / 3
                }

                // 统计子网格数量
                if (Array.isArray(child.material)) {
                    stats.submeshes += child.material.length
                } else {
                    stats.submeshes += 1
                }
            }

            if (child.isBone) {
                stats.bones++
                hasBones = true
            }
        })
        this.stats = stats
        return hasBones

    }

    getBoundingBox(object) {
        const box = new THREE.Box3()
        box.setFromObject(object)
        return box
    }
}