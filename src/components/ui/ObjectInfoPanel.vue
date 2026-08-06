<script setup>
import { computed } from 'vue'
import { useSceneStore } from '@/stores/sceneStore'
import { Objects } from '@/data/objects'
// import { useCameraController2 } from '@/components/three/CameraController2'

import SubComponent2 from '../modal/SubComponent2/SubComponent2.vue'
import SubComponent3 from '../modal/SubComponent3/SubComponent3.vue'
import SubComponent4 from '../modal/SubComponent4/SubComponent4.vue'
import SubComponent5 from '../modal/SubComponent5/SubComponent5.vue'
import SubComponent6 from '../modal/SubComponent6/SubComponent6.vue'

const sceneStore = useSceneStore()
// const cameraController2 = useCameraController2()

// 現在選択中Object 使用されていない。削除予定TODO
// const currentObject = computed(() => {
//   return Objects.find(
//     obj => obj.id === sceneStore.whichModalSelected
//   )
// })

const currentPanel = computed(() => {

  switch(sceneStore.whichModalSelected){

    case 2002:
      return SubComponent2

    case 2003:
      return SubComponent3

    case 2004:
      return SubComponent4

    case 2005:
      return SubComponent5

    case 2006:
      return SubComponent6

    default:
      return null
  }
})

// CLOSE 未使用。削除予定TODO
// const handleClose = () => {

//   if (currentObject.value?.cameraFocusOut) {

//     cameraController2.moveCamera(
//       currentObject.value.cameraFocusOut.position,
//       currentObject.value.cameraFocusOut.target
//     )
//   }

//   sceneStore.isModalOpen = false
//   sceneStore.whichModalSelected = null
// }

// モーダル表示の条件。isModalOpenかつ、2001,2007以外なら表示する
const canOpenModal = computed(() => {
  return (
    sceneStore.isModalOpen &&
    ![2001, 2007].includes(sceneStore.whichModalSelected)
  )
})
</script>

<template>
  <div v-if="canOpenModal" class="overlay">

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
  background: rgba(0,0,0,0);

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