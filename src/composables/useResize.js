// リサイズ対応用ロジック。画面サイズの変更等で表示がバグらないようにする。

import { onUnmounted } from 'vue'

/**
 * @param {HTMLElement} container - 3Dシーンを描画するコンテナ要素
 * @param {THREE.WebGLRenderer} renderer - WebGLRendererインスタンス
 * @param {THREE.Camera} camera - Cameraインスタンス
 */
export function useResize(container, renderer, camera) {
    const resize = () => {
        if (!container || !renderer || !camera) return

        const width = container.clientWidth
        const height = container.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()

        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
    }

    // ResizeObserverを使用してコンテナ要素のサイズ変化を監視
    let resizeObserver = null
    if (typeof window !== 'undefined' && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            resize()
        })
        resizeObserver.observe(container)
    } else {
        window.addEventListener('resize', resize)
    }

    // クリーンアップ処理
    const destroy = () => {
        if (resizeObserver) {
            resizeObserver.disconnect()
            resizeObserver = null
        } else {
            window.removeEventListener('resize', resize)
        }
    }

    // Vueのアンマウント時に自動的にクリーンアップを実行
    onUnmounted(() => {
        destroy()
    })

    // 初期化時に一度リサイズ処理を実行して、初期サイズを合わせる
    resize()

    return {
        resize,
        destroy,
    }
}