import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'

// 引数として受け取ったpositionとtargetを使って、カメラの移動目標をセットし、
// updateメソッドで実際の移動（lerp）処理を実行するコントローラー（旧CameraControllerを統合）

export function useCameraController2() {
    const MOVE_SPEED = 0.2  // 移動速度
    const ARRIVE_THRESHOLD = 0.005  // 目標到達判定のしきい値
    const sceneStore = useSceneStore()

    const moveCamera = (position, target) => {
        if (position && position !== '') {
            sceneStore.targetPosition = new THREE.Vector3(...position)
        }

        if (target && target !== '') {
            sceneStore.targetLookAt = new THREE.Vector3(...target)
        }
    }

    const update = () => {
        const camera = sceneStore.camera
        const controls = sceneStore.controls

        if (!camera || !controls) return

        const hasPositionTarget = !!sceneStore.targetPosition
        const hasLookAtTarget = !!sceneStore.targetLookAt

        if (hasPositionTarget || hasLookAtTarget) {                     
            // 移動中はコントロールとダンピングを無効化して干渉（カクツキ）を防ぐ
            controls.enabled = false
            controls.enableDamping = false

            // カメラ位置の移動
            if (hasPositionTarget) {
                camera.position.lerp(sceneStore.targetPosition, MOVE_SPEED)
                if (camera.position.distanceTo(sceneStore.targetPosition) < ARRIVE_THRESHOLD) {
                    camera.position.copy(sceneStore.targetPosition)
                    sceneStore.targetPosition = null
                }
            }

            // 注視点の移動
            if (hasLookAtTarget) {
                controls.target.lerp(sceneStore.targetLookAt, MOVE_SPEED)
                if (controls.target.distanceTo(sceneStore.targetLookAt) < ARRIVE_THRESHOLD) {
                    controls.target.copy(sceneStore.targetLookAt)
                    sceneStore.targetLookAt = null
                }
            }
        } else {
            // 移動が終わっていたらコントロールとダンピングを有効に戻す
            if (controls.enabled === false) {
                controls.enabled = true
                controls.enableDamping = true
            }
        }               //カメラ捜査終了ログをいれてカメラが動かなくなったときに
    }

    return {
        moveCamera,
        update
    }
}
