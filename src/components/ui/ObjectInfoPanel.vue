<script setup>
import { computed } from 'vue'
import { useSceneStore } from '@/stores/sceneStore'
import { Objects } from '@/data/objects'
import { useCameraController2 } from '@/components/three/CameraController2'

import OPobjectB from '../modal/SubComponent2/OPobject-b.vue'
import OPobjectC from '../modal/SubComponent3/OPobject-c.vue'
import OPobjectD from '../modal/SubComponent4/OPobject-d.vue'
import OPobjectE from '../modal/SubComponent5/OPobject-e.vue'
import OPobjectF from '../modal/SubComponent6/OPobject-f.vue'

const sceneStore = useSceneStore()
const cameraController2 = useCameraController2()

// 現在選択中Object
const currentObject = computed(() => {
  return Objects.find(
    obj => obj.id === sceneStore.whichModalSelected
  )
})

const currentPanel = computed(() => {

  switch(sceneStore.whichModalSelected){

    case 2002:
      return OPobjectB

    case 2003:
      return OPobjectC

    case 2004:
      return OPobjectD

    case 2005:
      return OPobjectE

    case 2006:
      return OPobjectF

    default:
      return null
  }
})

// CLOSE
const handleClose = () => {

  if (currentObject.value?.cameraFocusOut) {

    cameraController2.moveCamera(
      currentObject.value.cameraFocusOut.position,
      currentObject.value.cameraFocusOut.target
    )
  }

  sceneStore.isModalOpen = false
  sceneStore.whichModalSelected = null
}
</script>

<template>
  <div
    v-if="sceneStore.isModalOpen"
    class="overlay"
  >

    <div class="left-panel">

    </div>

    <div class="info-panel">

      <component :is="currentPanel" />

    </div>

  </div>
</template>

<style scoped>

.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  z-index: 100;
  color: white;
}

/* 左灰色 */
.left-panel {
  width: 30%;
  background: rgba(0,0,0,0.55);

  display: flex;
  align-items: end;

  padding: 40px;
}

/* 右白 */
.info-panel {
  flex: 1;

  padding: 80px;

  background:
    linear-gradient(
      to right,
      rgba(255,255,255,0.95),
      rgba(255,255,255,0.85)
    );

  color: black;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
}

.object-name {
  font-size: 48px;
  margin-bottom: 40px;
}

.description {
  font-size: 20px;
  line-height: 1.8;
}


</style>