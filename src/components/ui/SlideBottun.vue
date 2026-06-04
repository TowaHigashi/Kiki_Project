<script setup>
import { computed } from 'vue'
import { useSceneStore } from '@/stores/sceneStore'
import { Objects } from '@/data/objects'
import { modalComponentMap } from '@/data/modalComponentMap'
import { useCameraController2 } from '@/components/three/CameraController2'

const sceneStore = useSceneStore()
const cameraController2 = useCameraController2()

// 左側の遷移先オブジェクトIDを取得
const leftDestinationId = computed(() => {
  const currentId = sceneStore.whichModalSelected
  if (!currentId) return null
  return modalComponentMap[currentId]?.left || null
})

// 右側の遷移先オブジェクトIDを取得
const rightDestinationId = computed(() => {
  const currentId = sceneStore.whichModalSelected
  if (!currentId) return null
  return modalComponentMap[currentId]?.right || null
})

// 指定されたオブジェクトへカメラを移動させ、選択状態を更新する
const navigateTo = (destinationId) => {
  if (!destinationId) return

  const targetObject = Objects.find(obj => obj.id === Number(destinationId))
  if (!targetObject) return

  const position = targetObject.cameraFocusIn?.position
  const target = targetObject.cameraFocusIn?.target

  if (position && position !== '') {
    cameraController2.moveCamera(position, target)
  }

  sceneStore.whichModalSelected = destinationId
  console.log('開発用ログ: whichModalSelected を', destinationId, 'に更新しました')
}
</script>

<template>
  <Transition name="fade-container">
    <div v-if="sceneStore.isModalOpen" class="slide-navigation">
      <!-- 左ボタン -->
      <button 
        v-if="leftDestinationId" 
        class="nav-button left" 
        @click="navigateTo(leftDestinationId)"
        aria-label="前のオブジェクトへ"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- 右ボタン -->
      <button 
        v-if="rightDestinationId" 
        class="nav-button right" 
        @click="navigateTo(rightDestinationId)"
        aria-label="次のオブジェクトへ"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.slide-navigation {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: none;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.nav-button {
  pointer-events: auto;
  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.nav-button.left:hover {
  transform: scale(1.08) translateX(-2px);
}

.nav-button.right:hover {
  transform: scale(1.08) translateX(2px);
}

.nav-button:active {
  transform: scale(0.95);
}

.nav-button.left:active {
  transform: scale(0.95) translateX(-1px);
}

.nav-button.right:active {
  transform: scale(0.95) translateX(1px);
}

svg {
  transition: transform 0.3s ease;
}

.fade-container-enter-active,
.fade-container-leave-active {
  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-container-enter-from,
.fade-container-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(15px);
}

@media (max-width: 768px) {
  .slide-navigation {
    bottom: 20px;
    gap: 15px;
  }
  
  .nav-button {
    width: 44px;
    height: 44px;
  }
}
</style>
