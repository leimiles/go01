import * as THREE from 'three'
import { SkeletonHelper } from 'three'

export default class RenderModeController {
    constructor(model) {
        this.modelRoot = model
        this.originalMaterials = new Map()
        this.wireframeColor = null
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
    // 显示模型
    setModelVisible(visible) {
        this.modelVisible = visible
        if (this.modelRoot) {
            this.modelRoot.visible = visible
        }
    }
    // 显示骨骼
    setSkeletonVisible(visible) {
        this.skeletonVisible = visible
        if (this.skeletonHelper) {
            this.skeletonHelper.visible = visible
        } else if (visible) {
            this.createSkeletonHelper()
        }
    }
    // 创建可显示的骨骼
    createSkeletonHelper() {
        if (!this.modelRoot) return

        this.skeletonHelper = new SkeletonHelper(this.modelRoot)
        this.skeletonHelper.visible = this.skeletonVisible
        this.modelRoot.parent.add(this.skeletonHelper)
    }
    // 切换渲染模式
    setRenderMode(mode) {
        this.modelRoot.traverse(child => {
            if (child.isMesh || child.isSkinnedMesh) {
                const originalMaterial = this.originalMaterials.get(child.uuid)
                if (!originalMaterial) return

                // 如果没有线框颜色或仅线框，清除线框网格
                if (this.wireframeColor === null || this.wireframeColor === undefined || mode === 'wireframe') {
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
                // 如果线框网格不存在，且需要线框网格，则创建
                else if (
                    (mode === 'mesh+wireframe') &&
                    this.wireframeColor !== null
                ) {
                    this.createWireframeMesh(child)
                }

                // 处理主材质的切换
                switch (mode) {
                    case 'wireframe':
                        if (!child.geometry.attributes.aBarycentric) {
                            addBarycentricCoordinates(child.geometry)
                        }
                        // 主材质替换为支持骨骼的线框 Shader
                        child.material = createWireframeShaderMaterial(
                            this.wireframeColor,
                            child.isSkinnedMesh
                        )
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
    }
}

function addBarycentricCoordinates(geometry) {
    const count = geometry.attributes.position.count
    const bary = []

    for (let i = 0; i < count; i += 3) {
        bary.push(1, 0, 0)
        bary.push(0, 1, 0)
        bary.push(0, 0, 1)
    }
    geometry.setAttribute('aBarycentric', new THREE.Float32BufferAttribute(bary, 3))
}

function createWireframeShaderMaterial(colorHex, isSkinnedMesh = false) {
    const defaultColor = 0x808080
    const finalColor = colorHex ?? defaultColor

    const defines = {}
    if (isSkinnedMesh) {
        defines.USE_SKINNING = '' // 启用骨骼动画支持
    }
    return new THREE.ShaderMaterial({
        defines,
        // 顶点着色器：skinning + barycentric
        vertexShader: `
            attribute vec3 aBarycentric;
            varying vec3 vBarycentric;
            vec3 transformed;

            #include <common>
            ${isSkinnedMesh ? '#include <skinning_pars_vertex>' : ''}

            void main() {
                vBarycentric = aBarycentric;
                transformed = position;
                ${isSkinnedMesh ?
                '#include <skinbase_vertex>\n#include <skinning_vertex>' :
                '#include <begin_vertex>'
            }
                #include <project_vertex>
            }
        `,
        // 片元着色器：只渲染正面线条
        fragmentShader: `
            varying vec3 vBarycentric;
            uniform vec3 uColor;
            uniform float uLineWidth;

            // 计算每个片元离三角形边界的距离
            float edgeFactor() {
                vec3 d = fwidth(vBarycentric);
                vec3 a3 = smoothstep(vec3(0.0), d * uLineWidth, vBarycentric);
                return min(min(a3.x, a3.y), a3.z);
            }

            void main() {
                if (!gl_FrontFacing) discard;
                float edge = edgeFactor();
                // 线框部分不透明，面内区域透明
                gl_FragColor = vec4(uColor, 1.0 - edge);
            }
        `,
        uniforms: {
            uColor: { value: new THREE.Color(finalColor) },
            uLineWidth: { value: 1.0 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false
    })
}