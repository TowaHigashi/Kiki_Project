<script setup>
import { ref, watch } from 'vue'
import { useSceneStore } from '@/stores/sceneStore'
import { Objects } from '@/data/objects'
import { useCameraController2 } from '@/components/three/CameraController2'

const sceneStore = useSceneStore()
const cameraController2 = useCameraController2()
const isVisible = ref(false)

// isModalOpenの状態をそのまま表示フラグに同期させる
// trueで表示、falseで非表示。さらにボタン押下時にも即座に非表示にする
watch(() => sceneStore.isModalOpen, (newVal) => {
  isVisible.value = newVal
})

const handleBack = () => {
  // 押下時にボタンを即座に非表示にする
  isVisible.value = false
  
  // モーダル表示状態を解除する
  sceneStore.isModalOpen = false
  console.log('開発用ログ: isModalOpen を false にしました')

  // whichModalSelectedから選択中のIDを取得
  const id = sceneStore.whichModalSelected
  if (!id) return

  // IDから対象のオブジェクトデータを取得
  const targetObject = Objects.find(obj => obj.id === id)
  if (!targetObject || !targetObject.cameraFocusOut) return

  const focusOutPosition = targetObject.cameraFocusOut.position
  const focusOutTarget = targetObject.cameraFocusOut.target

  // cameraController2を使ってカメラを移動
  if (focusOutPosition && focusOutPosition !== '') {
    cameraController2.moveCamera(focusOutPosition, focusOutTarget)
  }

  // オブジェクト選択状態を解消する
  sceneStore.whichModalSelected = null
  console.log('開発用ログ: whichModalSelected を null にしました')
}
</script>

<template>
  <Transition name="fade">
    <button 
      v-if="isVisible" 
      class="back-button" 
      @click="handleBack"
      aria-label="モーダルを閉じる"
    >
      <span class="icon">×</span>
      <span class="text">CLOSE</span>
    </button>
  </Transition>
</template>

<style scoped>
.back-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
  
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.back-button:active {
  transform: translateY(0);
}

.icon {
  font-size: 18px;
  line-height: 1;
}

/* フェードアニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>


