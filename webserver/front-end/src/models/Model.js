import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';

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

}