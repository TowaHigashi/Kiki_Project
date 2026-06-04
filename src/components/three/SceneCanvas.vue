<script setup>

import { ref, onMounted, onUnmounted } from 'vue'

import { useThreeScene } from '@/composables/useThreeScene'
import { useRenderer } from '@/composables/useRenderer'
import { useCamera } from '@/composables/useCamera'
import { useLight } from '@/composables/useLight'
import { useAnimationFrame } from '@/composables/useAnimationFrame'
import { useOrbitControls } from '@/composables/useOrbitControls'
import { useMouse } from '@/composables/useMouse'
import { useInteractionManager } from '@/components/three/InteractionManager'
import { useCameraController2 } from '@/components/three/CameraController2'
import { useCameraBlurrer } from '@/components/three/CameraBlurrer'
import { useSceneStore } from '@/stores/sceneStore'
import { useStrollingDetection } from '@/composables/useStrollingDetection'
import ObjectInfoPanel from '@/components/ui/ObjectInfoPanel.vue'

import Object0a from '@/components/objects/Object0-a.vue'
import Object0b from '@/components/objects/Object0-b.vue'
import Object0c from '@/components/objects/Object0-c.vue'
import Object0d from '@/components/objects/Object0-d.vue'
import Object0e from '@/components/objects/Object0-e.vue'
import Object0f from '@/components/objects/Object0-f.vue'


const containerRef = ref(null)

const { scene } = useThreeScene()
const sceneStore = useSceneStore()

let renderer
let camera
let controls
let animationFrame
let mouseController
let interactionManager
let strollingDetection
let cameraController
let cameraBlurrer

onMounted(() => {
  const container = containerRef.value

  // renderer
  renderer = useRenderer(container).renderer
  // camera
  camera = useCamera(container).camera
  sceneStore.camera = camera  // 追加（バックボタン1）
  // light
  useLight(scene)
  // mouse
  mouseController = useMouse(container)
  // orbit controls
  controls = useOrbitControls(
    camera,
    renderer
  ).controls
  sceneStore.controls = controls // 追加（バックボタン1）
  // camera controller
  cameraController = useCameraController2()

  // strolling detection
  strollingDetection = useStrollingDetection({
    cameraPosition: camera,
    sceneStore,
    threshold: 2,
  })
  // animation
  animationFrame = useAnimationFrame(() => {
    // カメラ移動の更新
    cameraController.update()

    controls.update()

    strollingDetection.update()

    renderer.render(scene, camera)
  })

  animationFrame.start()

  interactionManager =
    useInteractionManager({
      container,
      scene,
      camera,
      mouse: mouseController.mouse,
    })

  cameraBlurrer = useCameraBlurrer({
    container,
    sceneStore,
  })
})

onUnmounted(() => {
  animationFrame?.stop()

  mouseController?.destroy()

  interactionManager?.destroy()
  
  cameraBlurrer?.destroy()
})

</script>

<template>
  <div ref="containerRef" class="scene-container">
    <Object0a :scene="scene" />
    <Object0b :scene="scene" /> 
    <Object0c :scene="scene" />
    <Object0d :scene="scene" />
    <Object0e :scene="scene" />
    <Object0f :scene="scene" />


    <ObjectInfoPanel />
  </div>
</template>

<style scoped>
.scene-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>