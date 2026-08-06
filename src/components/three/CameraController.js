// 廃止予定TODO

// カメラ移動の制御。targetPosition/targetLookAtへのスムーズな移動（lerp）を担当

export function useCameraController({
    camera,
    controls,
    sceneStore
}) {
    const update = () => {
        const hasPositionTarget = !!sceneStore.targetPosition;
        const hasLookAtTarget = !!sceneStore.targetLookAt;

        if (hasPositionTarget || hasLookAtTarget) {
            // 移動中はコントロールを無効化して干渉を防ぐ
            controls.enabled = false;

            // カメラ位置の移動
            if (hasPositionTarget) {
                camera.position.lerp(sceneStore.targetPosition, 0.1);
                if (camera.position.distanceTo(sceneStore.targetPosition) < 0.05) {
                    camera.position.copy(sceneStore.targetPosition);
                    sceneStore.targetPosition = null;
                }
            }

            // 注視点の移動
            if (hasLookAtTarget) {
                controls.target.lerp(sceneStore.targetLookAt, 0.1);
                if (controls.target.distanceTo(sceneStore.targetLookAt) < 0.05) {
                    controls.target.copy(sceneStore.targetLookAt);
                    sceneStore.targetLookAt = null;
                }
            }
        } else {
            // 移動が終わっていたらコントロールを有効にする
            if (controls.enabled === false) {
                controls.enabled = true;
            }
        }
    }

    return {
        update
    }
}