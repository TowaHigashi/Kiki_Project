<script setup>//右、左ボタンの処理
import { useSceneStore } from '@/stores/sceneStore'

const sceneStore = useSceneStore()

const nextPage = () => {
  sceneStore.whichModalSelected = 2002
}

const prevPage = () => {
  sceneStore.whichModalSelected = 2005
}
</script>

<template>
  <h1>猫です。(予備)</h1>
</template>

<style scoped>
.navigation {
  position: absolute;

  bottom: 30px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  gap: 20px;
}

.nav-btn {
  background: transparent;
  border: none;

  font-size: 40px;

  cursor: pointer;

  color: #c46ac4;

  transition: 0.2s;
}

.nav-btn:hover {
  transform: scale(1.2);
}
</style>