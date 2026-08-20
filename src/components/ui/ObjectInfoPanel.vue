<script setup>
import { computed } from 'vue'
import { useSceneStore } from '@/stores/sceneStore'
import { Objects } from '@/data/objects'

import SubComponent2 from '../modal/SubComponent2/SubComponent2.vue'
import SubComponent3 from '../modal/SubComponent3/SubComponent3.vue'
import SubComponent4 from '../modal/SubComponent4/SubComponent4.vue'
import SubComponent5 from '../modal/SubComponent5/SubComponent5.vue'
import SubComponent6 from '../modal/SubComponent6/SubComponent6.vue'

const sceneStore = useSceneStore()

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
  overflow: hidden;
  /* SoundSetting の backdrop と同じ薄いグレー */
  background: rgba(0, 0, 0, 0.28);
  /* 左の 3D / スクリーン UI へ操作を通す */
  pointer-events: none;
}

/* 左：3D 空間側（グレーは overlay 全体、操作は透過） */
.left-panel {
  width: 30%;
  background: transparent;

  display: flex;
  align-items: end;

  padding: 40px;
}

/* 右白（長いコンテンツは縦スクロール） */
.info-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  pointer-events: auto;

  padding: 40px 80px 80px;

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