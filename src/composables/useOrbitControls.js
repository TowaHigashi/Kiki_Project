// OrbitControls生成。damping、rotate speed、zoom speedなど

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Objects } from '@/data/objects.js'

export function useOrbitControls(
    camera,
    renderer
) {
    const controls = new OrbitControls(
        camera,
        renderer.domElement
    )

    // Objectsからtargetを取得
    const config = Objects.find(obj => obj.type === 'config')
    if (config && config.target) {
        controls.target.set(...config.target)
    }

    // smooth motion
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // rotate speed
    controls.rotateSpeed = 1.0

    // zoom speed
    controls.zoomSpeed = 0.8

    // pan
    controls.panSpeed = 0.8

    // zoom enable
    controls.enableZoom = true

    // auto rotate
    controls.autoRotate = false

    // limits
    controls.minDistance = 0.3
    controls.maxDistance = 40

    return {
        controls,
    }
}
