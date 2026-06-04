// 描画設定。antialias、shadow、pixelRatio、sizeなど

import * as THREE from 'three'

export function useRenderer(container) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
    })

    renderer.setPixelRatio(window.devicePixelRatio)

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    )

    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    container.appendChild(renderer.domElement)

    return {
        renderer,
    }
}