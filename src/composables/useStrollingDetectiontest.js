// カメラが初期位置から一定以上離れたらsceneStore.isUserStrollingをtrueにする

import * as THREE from 'three'

import { Objects } from '@/data/objects'

export function useStrollingDetection({
    cameraPosition,
    sceneStore,
    threshold = 2,
}) {
    const initialCameraObject =
        Objects.find(
            (object) => object.id === 1001
        )

    const initialPosition =
        new THREE.Vector3(
            ...initialCameraObject.position
        )

    const update = () => {
        // モーダルが開いている時は強制的に散策状態をfalseにして終了する
        if (sceneStore.isModalOpen) {
            if (sceneStore.isUserStrolling) {
                sceneStore.isUserStrolling = false
                console.log('開発用ログ: isUserStrolling を false にしました')
            }
            return
        }
        const distance =
            cameraPosition.position.distanceTo(
                initialPosition
            )

        const isStrolling =
            distance > threshold

        if (
            sceneStore.isUserStrolling !==
            isStrolling
        ) {
            sceneStore.isUserStrolling =
                isStrolling
            console.log(`開発用ログ: isUserStrolling を ${isStrolling} にしました`)
        }
    }

    return {
        update,
    }
}