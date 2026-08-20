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
import { useSoundStore } from '@/stores/soundStore'
import { useStrollingDetection } from '@/composables/useStrollingDetection'
import { useScreenVideoControls } from '@/composables/useScreenVideoControls'
import ObjectInfoPanel from '@/components/ui/ObjectInfoPanel.vue'
import ScreenVideo from '@/components/sound/ScreenVideo.vue'

import SceneObject from '@/components/objects/SceneObject.vue'
import { Objects } from '@/data/objects'

const getObj = (id) => {
  return Objects.find(obj => obj.id === id)
}

const containerRef = ref(null)
const screenVideoRef = ref(null)

const { scene } = useThreeScene()
const sceneStore = useSceneStore()
const soundStore = useSoundStore()

let renderer
let camera
let controls
let animationFrame
let mouseController
let interactionManager
let strollingDetection
let cameraController
let cameraBlurrer
let screenVideoControls

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

    screenVideoRef.value?.update?.()

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

  screenVideoControls = useScreenVideoControls({
    container,
    scene,
    camera,
    mouse: mouseController.mouse,
    getMesh: () => screenVideoRef.value?.getMesh?.() ?? null,
    getVideo: () => screenVideoRef.value?.getVideo?.() ?? null,
    onHoverChange: (visible) => {
      screenVideoRef.value?.setUiVisible?.(visible)
    },
    canPlay: () => soundStore.videoEnabled,
  })
})

onUnmounted(() => {
  animationFrame?.stop()

  mouseController?.destroy()

  interactionManager?.destroy()

  cameraBlurrer?.destroy()

  screenVideoControls?.destroy()
})

</script>

<template>
  <div ref="containerRef" class="scene-container">

    <SceneObject :scene="scene" :object-data="getObj(2001)" />
    <SceneObject :scene="scene" :object-data="getObj(2002)" />
    <SceneObject :scene="scene" :object-data="getObj(2003)" />
    <SceneObject :scene="scene" :object-data="getObj(2004)" />
    <SceneObject :scene="scene" :object-data="getObj(2005)" />
    <SceneObject :scene="scene" :object-data="getObj(2006)" />
    <SceneObject :scene="scene" :object-data="getObj(2007)" />
    <SceneObject :scene="scene" :object-data="getObj(2101)" />
    <SceneObject :scene="scene" :object-data="getObj(2102)" />
    <SceneObject :scene="scene" :object-data="getObj(2103)" />
    <SceneObject :scene="scene" :object-data="getObj(2104)" />
    <!-- 動画は GLB ではないため ScreenVideo で生成（メタデータは getObj(3001)） -->
    <ScreenVideo
      ref="screenVideoRef"
      :scene="scene"
      :object-data="getObj(3001)"
    />
    <!-- コンポーネント読み込み処理は最終的に以下に移管TODO　※コード短縮のため -->
    <!-- 
    <SceneObject
      v-for="objData in sceneObjects"
      :key="objData.id"
      :scene="scene"
      :object-data="objData"
    /> -->

    <ObjectInfoPanel />
  </div>
</template>

<style scoped>
.scene-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
