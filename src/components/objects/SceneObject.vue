<script setup>
import { onMounted, onUnmounted } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps({
  scene: {
    type: Object,
    required: true,
  },
  objectData: {
    type: Object,
    required: true,
  },
})

let loadedModel = null

onMounted(() => {
  if (!props.objectData?.path) return

  const loader = new GLTFLoader()

  loader.load(props.objectData.path, (gltf) => {
    const model = gltf.scene
    loadedModel = model

    if (props.objectData.position) {
      model.position.set(...props.objectData.position)
    }

    if (props.objectData.rotation) {
      model.rotation.set(...props.objectData.rotation)
    }

    if (props.objectData.scale) {
      model.scale.set(...props.objectData.scale)
    }

    // userData付与と透明化処理
    model.traverse((child) => {
      if (child.isMesh) {
        
        // オブジェクトを非表示（透明）にしつつ、クリック判定だけ残す設定
        if (props.objectData.invisible) {
          // マテリアルが複数ある場合も考慮して配列かどうか判定
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach(mat => {
            mat.transparent = true
            mat.opacity = 0
            mat.depthWrite = false // 他のオブジェクトの描画を邪魔しないようにする
          })
        }

        child.userData = {
          ...child.userData,
          type: props.objectData.type,
          fileName: props.objectData.fileName,
          path: props.objectData.path,
          position: props.objectData.position,
          target: props.objectData.target,
          name: props.objectData.name,
          id: props.objectData.id,
          cameraFocusIn: props.objectData.cameraFocusIn,
          cameraFocusOut: props.objectData.cameraFocusOut,
        }
      }
    })

    if (props.scene) {
      props.scene.add(model)
    }
  })
})

onUnmounted(() => {
  if (loadedModel && props.scene) {
    props.scene.remove(loadedModel)
  }
})
</script>

<template></template>
