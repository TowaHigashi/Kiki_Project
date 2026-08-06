<script setup>

//右、左ボタンの処理。未使用のため削除予定TODO

// import { useSceneStore } from '@/stores/sceneStore'
// const sceneStore = useSceneStore()
// const nextPage = () => {
//   sceneStore.whichModalSelected = 2003
// }

// const prevPage = () => {
//   sceneStore.whichModalSelected = 2006
// }
</script>

<template>

  <h1>ARTIST</h1>

  <img src="/object-images/object0-b/kiki-rogo.png" 
  style="width: 100px;"
    alt="Kiki's World"
  class="logo">

  <p>
    ここにkikiの説明文
  </p>

<!-- 未使用のスライドボタン。削除予定TODO
 <div class="navigation">
  <button
    class="nav-btn"
    @click="prevPage"
  >
    ◀
  </button>

  <button
    class="nav-btn"
    @click="nextPage"
  >
    ▶
  </button>

</div> -->

</template>

<style scoped>
.logo{
  opacity: 1;
  filter: none;
  mix-blend-mode: normal;

  position: relative;
  z-index: 10;
}

/* .navigation { 未使用のCSS。削除予定TODO
  position: absolute;

  bottom: 30px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  gap: 20px;
} */

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