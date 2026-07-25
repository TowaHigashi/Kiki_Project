<script setup>//右、左ボタンの処理
import { useSceneStore } from '@/stores/sceneStore'

const sceneStore = useSceneStore()

const nextPage = () => {
  sceneStore.whichModalSelected = 2006
}

const prevPage = () => {
  sceneStore.whichModalSelected = 2004
}
</script>

<template>
  <div>
    <h1>YOUTUBE</h1>
    
  </div>
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