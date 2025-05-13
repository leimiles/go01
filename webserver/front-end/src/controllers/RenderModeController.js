import * as THREE from 'three'

export default class RenderModeController {
    constructor(model) {
        this.modelRoot = model
        this.originalMaterials = new Map()
        this.wireframeColor = null
        this.grayMaterial = null
    }
    // 初始化保存原始材质
    cacheOriginalMaterials() {
        this.modelRoot.traverse(child => {
            if (child.isMesh) {
                this.originalMaterials.set(child.uuid, child.material)
            }
        })
    }
    // 设置线框颜色
    setWireframeColor(hexColor) {
        this.wireframeColor = hexColor
    }
    // 切换渲染模式
    setRenderMode(mode) {
        this.modelRoot.traverse(child => {
            if (child.isMesh || child.isSkinnedMesh) {
                const originalMaterial = this.originalMaterials.get(child.uuid)
                if (!originalMaterial) return

                // 如果没有线框颜色，清除线框网格
                if (this.wireframeColor === null || this.wireframeColor === undefined) {
                    if (child.userData.wireframeMesh) {
                        child.remove(child.userData.wireframeMesh)
                        child.userData.wireframeMesh.material.dispose()
                        delete child.userData.wireframeMesh
                    }
                }
                // 如果线框网格已存在，直接更新颜色
                else if (child.userData.wireframeMesh) {
                    const wireframeMesh = child.userData.wireframeMesh
                    wireframeMesh.material.color.setHex(this.wireframeColor)
                }
                // 如果线框网格不存在，且需要线框模式，则创建
                else if (
                    (mode === 'wireframe' || mode === 'mesh+wireframe') &&
                    this.wireframeColor !== null
                ) {
                    this.createWireframeMesh(child)
                }

                // 处理主材质的切换
                switch (mode) {
                    case 'wireframe':
                        if (!this.grayMaterial) {
                            this.grayMaterial = new THREE.MeshBasicMaterial({ color: 0xB0C4DE })
                        }
                        child.material = this.grayMaterial
                        break

                    case 'mesh+wireframe':
                        child.material = originalMaterial
                        break

                    default:
                        child.material = originalMaterial
                        break
                }
            }
        })
    }

    // 创建线框网格
    createWireframeMesh(child) {
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: this.wireframeColor,
            wireframe: true,
        })

        const wireframeMesh = child.isSkinnedMesh
            ? new THREE.SkinnedMesh(child.geometry, wireframeMaterial)
            : new THREE.Mesh(child.geometry, wireframeMaterial)

        if (child.isSkinnedMesh) {
            wireframeMesh.bind(child.skeleton, child.bindMatrix)
            wireframeMesh.skeleton = child.skeleton
        }

        wireframeMesh.renderOrder = 1
        child.add(wireframeMesh)
        child.userData.wireframeMesh = wireframeMesh
    }

    dispose() {
        this.modelRoot.traverse(child => {
            if (child.userData.wireframeMesh) {
                child.remove(child.userData.wireframeMesh)
                child.userData.wireframeMesh.material.dispose()
                delete child.userData.wireframeMesh
            }
        })

        if (this.grayMaterial) {
            this.grayMaterial.dispose()
            this.grayMaterial = null
        }
    }
}