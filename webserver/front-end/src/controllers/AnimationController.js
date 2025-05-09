import { AnimationMixer } from 'three'

export default class AnimationManager {
    constructor(modelRoot, onDuration = () => { }) {
        this.mixer = new AnimationMixer(modelRoot);
        this.actions = new Map()
        this.currentAction = null
        this.modelRoot = modelRoot
    }

    // 添加动画
    addAnimations(clips) {
        clips.forEach(clip => {
            const fixedClip = this.fixAnimationPaths(clip.clone(), this.modelRoot)
            const action = this.mixer.clipAction(fixedClip)
            this.actions.set(clip.name, action)
        })
    }

    // 播放指定动画
    playAnimation(name) {
        this.stopCurrent();
        this.currentAction = this.actions.get(name);
        if (this.currentAction) {
            this.currentAction.play();
        }
    }

    // 修正动画路径
    fixAnimationPaths(clip, modelRoot) {
        // 收集模型所有骨骼/网格的名称
        const existingNames = new Set()
        modelRoot.traverse(obj => {
            if (obj.name) existingNames.add(obj.name)
        })
        // 修正动画轨道中不匹配的名称
        clip.tracks.forEach(track => {
            const [originalTarget] = track.name.split('.')
            if (!existingNames.has(originalTarget)) {
                const fallbackTarget = modelRoot.name || 'Root'
                console.warn(`🚨 替换轨道路径: ${track.name} → ${track.name.replace(originalTarget, fallbackTarget)}`)
                track.name = track.name.replace(originalTarget, fallbackTarget)
            }
        })

        return clip
    }

    // 更新动画状态
    update(delta) {
        if (this.mixer) this.mixer.update(delta)
    }


    // 停止当前动画
    stopCurrent() {
        if (this.currentAction) {
            this.currentAction.stop()
            this.currentAction = null
        }
    }
    // 停止所有动画
    stopAll() {
        if (this.currentAction) {
            this.currentAction.stop();
            this.currentAction = null;
        }
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
    }
    // 释放资源
    dispose() {
        this.stopAll();
        this.mixer = null;
        this.model = null;
    }
}