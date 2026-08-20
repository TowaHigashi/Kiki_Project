<!-- 左上ハンバーガーから開く音量設定パネル。値は soundStore と双方向同期。 -->
<script setup>
import { computed, ref } from 'vue'
import { useSoundStore } from '@/stores/soundStore'

const soundStore = useSoundStore()
const isOpen = ref(false)

const masterPercent = computed({
  get: () => Math.round(soundStore.masterVolume * 100),
  set: (value) => {
    soundStore.masterVolume = clamp01(value / 100)
  },
})

const environmentPercent = computed({
  get: () => Math.round(soundStore.environmentVolume * 100),
  set: (value) => {
    soundStore.environmentVolume = clamp01(value / 100)
  },
})

const videoPercent = computed({
  get: () => Math.round(soundStore.videoVolume * 100),
  set: (value) => {
    soundStore.videoVolume = clamp01(value / 100)
  },
})

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0))
}

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function onMasterInput(event) {
  masterPercent.value = Number(event.target.value)
}

function onEnvironmentInput(event) {
  environmentPercent.value = Number(event.target.value)
}

function onVideoInput(event) {
  videoPercent.value = Number(event.target.value)
}
</script>

<template>
  <div class="sound-setting-root">
    <button
      type="button"
      class="menu-button"
      :class="{ 'is-open': isOpen }"
      :aria-expanded="isOpen"
      aria-controls="sound-setting-panel"
      aria-label="音量設定メニュー"
      @click="toggle"
    >
      <span class="menu-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>

    <Transition name="backdrop-fade">
      <div
        v-if="isOpen"
        class="backdrop"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <Transition name="panel-slide">
      <aside
        v-if="isOpen"
        id="sound-setting-panel"
        class="panel"
        role="dialog"
        aria-label="SOUND 設定"
        @pointerdown.stop
        @click.stop
      >
        <h2 class="panel-title">SOUND</h2>

        <div class="row row--master">
          <div class="row-head">
            <span class="label">Master</span>
            <span class="percent">{{ masterPercent }}%</span>
          </div>
          <input
            class="slider slider--master"
            type="range"
            min="0"
            max="100"
            step="1"
            :value="masterPercent"
            aria-label="Master 音量"
            @input="onMasterInput"
          >
        </div>

        <div class="row">
          <div class="row-head">
            <span class="label">Environment</span>
            <span class="percent">{{ environmentPercent }}%</span>
          </div>
          <input
            class="slider"
            type="range"
            min="0"
            max="100"
            step="1"
            :value="environmentPercent"
            aria-label="Environment 音量"
            @input="onEnvironmentInput"
          >
        </div>

        <div class="row">
          <div class="row-head">
            <span class="label">Screen</span>
            <span class="percent">{{ videoPercent }}%</span>
          </div>
          <input
            class="slider"
            type="range"
            min="0"
            max="100"
            step="1"
            :value="videoPercent"
            aria-label="Screen video 音量"
            @input="onVideoInput"
          >
        </div>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.sound-setting-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;
}

.menu-button,
.backdrop,
.panel {
  pointer-events: auto;
}

.menu-button {
  position: fixed;
  top: 19px;
  left: 19px;
  z-index: 220;
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  background: rgba(12, 16, 22, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.menu-button:hover,
.menu-button.is-open {
  background: rgba(20, 26, 34, 0.72);
  border-color: rgba(255, 255, 255, 0.35);
}

.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 14px;
}

.menu-icon span {
  display: block;
  height: 1.5px;
  border-radius: 1px;
  background: #fff;
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.menu-button.is-open .menu-icon span:nth-child(1) {
  transform: translateY(5.5px) rotate(45deg);
}

.menu-button.is-open .menu-icon span:nth-child(2) {
  opacity: 0;
}

.menu-button.is-open .menu-icon span:nth-child(3) {
  transform: translateY(-5.5px) rotate(-45deg);
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 210;
  background: rgba(0, 0, 0, 0.28);
}

.panel {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 215;
  width: min(288px, 86vw);
  height: 100vh;
  padding: 70px 22px 26px;
  box-sizing: border-box;
  background: linear-gradient(
    180deg,
    rgba(14, 18, 24, 0.92) 0%,
    rgba(10, 12, 16, 0.88) 100%
  );
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  color: #f4f4f2;
  box-shadow: 10px 0 32px rgba(0, 0, 0, 0.35);
}

.panel-title {
  margin: 0 0 29px;
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  font-size: 1.08rem;
  font-weight: 650;
  letter-spacing: 0.28em;
}

.row {
  margin-bottom: 21px;
}

.row--master {
  margin-bottom: 27px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.row-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.label {
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  color: rgba(244, 244, 242, 0.82);
}

.row--master .label {
  font-size: 0.84rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #fff;
}

.percent {
  font-variant-numeric: tabular-nums;
  font-size: 0.62rem;
  color: rgba(244, 244, 242, 0.65);
}

.row--master .percent {
  font-size: 0.76rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.slider {
  width: 100%;
  height: 14px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-runnable-track {
  height: 2.5px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.22);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  margin-top: -3.75px;
  border: none;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.12);
}

.slider--master::-webkit-slider-runnable-track {
  height: 4px;
}

.slider--master::-webkit-slider-thumb {
  width: 13px;
  height: 13px;
  margin-top: -4.5px;
}

.slider::-moz-range-track {
  height: 2.5px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.22);
}

.slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background: #fff;
}

.slider--master::-moz-range-track {
  height: 4px;
}

.slider--master::-moz-range-thumb {
  width: 13px;
  height: 13px;
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.28s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(-100%);
}
</style>
