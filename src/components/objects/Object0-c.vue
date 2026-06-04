<script setup>
import { onMounted } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Objects } from '@/data/objects'

const props = defineProps({
  scene: Object,
})

const MODEL_PATH = '/models/Object0-c.glb'

onMounted(() => {
  const loader = new GLTFLoader()

  loader.load(MODEL_PATH, (gltf) => {
    const model = gltf.scene

    const objectData = Objects.find(
      (object) => object.path === MODEL_PATH
    )

    if (objectData?.position) {
      model.position.set(
        ...objectData.position
      )
    }

    if (objectData?.rotation) {
      model.rotation.set(
        ...objectData.rotation
      )
    }

    if (objectData?.scale) {
      model.scale.set(
        ...objectData.scale
      )
    }

    // userData付与
    model.traverse((child) => {
      if (child.isMesh) {
        child.userData = {
          ...child.userData,

          type: objectData?.type,
          fileName: objectData?.fileName,
          path: objectData?.path,

          position: objectData?.position,

          target: objectData?.target,

          name: objectData?.name,

          id: objectData?.id,

          cameraFocusIn:
            objectData?.cameraFocusIn,

          cameraFocusOut:
            objectData?.cameraFocusOut,
        }
      }
    })

    props.scene.add(model)
  })
})
</script>

<template></template>