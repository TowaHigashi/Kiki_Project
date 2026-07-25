// scene生成のみ。backgroundColor、fog、environmentなどのscene全体設定

import * as THREE from 'three'

export function useThreeScene() {
    const scene = new THREE.Scene()

    // background
    scene.background = new THREE.Color(0x202025)

    // fog
    //scene.fog = new THREE.Fog(0x202025, 10, 50)

    return {
        scene,
    }
}