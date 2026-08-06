<script setup>

//右、左ボタンの処理。未使用のため削除予定TODO

// import { useSceneStore } from '@/stores/sceneStore'
// const sceneStore = useSceneStore()
// const nextPage = () => {
//   sceneStore.whichModalSelected = 2004
// }
// const prevPage = () => {
//   sceneStore.whichModalSelected = 2002
// }
</script>

<template>
  <div class="works-container">

    <h1 class="works-title">
      WORKS
    </h1>

    <div class="works-grid">

      <div class="work-item">
        <img
          src="/object-images/object0-c/jyorougumo.png"
          alt="女郎蜘蛛"
        >
        <p>女郎蜘蛛</p>
      </div>

      <div class="work-item">
        <img
          src="/object-images/object0-c/pandora.png"
          alt="パンドラ"
        >
        <p>パンドラ</p>
      </div>

      <div class="work-item">
        <img
          src="/object-images/object0-c/darin-test.jpg"
          alt="作品3"
        >
        <p>作品3</p>
      </div>

      <div class="work-item">
        <img
          src="/object-images/object0-c/inferno-test.png"
          alt="作品4"
        >
        <p>作品4</p>
      </div>

      <div class="work-item">
        <img
          src="/object-images/object0-c/rairakku-test.jpg"
          alt="作品5"
        >
        <p>作品5</p>
      </div>

      <div class="work-item">
        <img
          src="/object-images/object0-c/tengoku-test.jpg"
          alt="作品6"
        >
        <p>作品6</p>
      </div>

    </div>

  </div>
</template>
 

<style scoped>

.works-container {
  width: 100%;
  height: 100%;
}

.works-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
}

.works-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 40px;

  justify-items: center;
}

.work-item {
  text-align: center;
}

.work-item img {
  width: 180px;
  height: 180px;

  object-fit: cover;

  border: 1px solid #000;
}

.work-item p {
  margin-top: 10px;
  font-size: 16px;
}

/* .navigation { 未使用のため削除予定TODO
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
