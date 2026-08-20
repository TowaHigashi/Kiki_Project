<script setup>
</script>

<template>

  <h1 class="modal-title">ARTIST</h1>

  <img :src="'/images/SubComponent2/kiki-rogo.png'" 
  style="width: 100px;"
    alt="Kiki's World"
  class="logo">

  <p>
    ここにkikiの説明文
  </p>

</template>

<style scoped>
.modal-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
}

.logo{
  opacity: 1;
  filter: none;
  mix-blend-mode: normal;

  position: relative;
  z-index: 10;
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
