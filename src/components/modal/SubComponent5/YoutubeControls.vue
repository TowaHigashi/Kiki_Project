<!-- 独自ミニマル操作 UI（再生 / シーク / 音量） -->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  ready: { type: Boolean, default: false },
  playing: { type: Boolean, default: false },
  currentTime: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  volume: { type: Number, default: 100 },
  muted: { type: Boolean, default: false },
})

const emit = defineEmits([
  'toggle-play',
  'seek',
  'set-volume',
  'toggle-mute',
  'seeking-change',
])

const scrubbing = ref(false)
const scrubValue = ref(0)

const displayTime = computed(() =>
  scrubbing.value ? scrubValue.value : props.currentTime
)

const progressPercent = computed(() => {
  if (!props.duration) return 0
  return Math.min(100, Math.max(0, (displayTime.value / props.duration) * 100))
})

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const total = Math.floor(sec)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function onSeekPointerDown() {
  scrubbing.value = true
  scrubValue.value = props.currentTime
  emit('seeking-change', true)
}

function onSeekInput(event) {
  const value = Number(event.target.value)
  scrubValue.value = value
  if (scrubbing.value) {
    emit('seek', value)
  }
}

function onSeekPointerUp(event) {
  const value = Number(event.target.value)
  scrubbing.value = false
  emit('seek', value)
  emit('seeking-change', false)
}

function onSeekChange(event) {
  // click のみの環境向けフォールバック
  if (scrubbing.value) return
  emit('seek', Number(event.target.value))
}

function onVolumeInput(event) {
  emit('set-volume', Number(event.target.value))
}

function stopPropagation(event) {
  event.stopPropagation()
}
</script>

<template>
  <div class="controls" @click="stopPropagation">
    <div class="seek-row">
      <span class="time">{{ formatTime(displayTime) }}</span>

      <div class="seek-track">
        <div class="seek-fill" :style="{ width: `${progressPercent}%` }" />
        <input
          class="seek-input"
          type="range"
          min="0"
          :max="duration || 0"
          step="0.1"
          :value="displayTime"
          :disabled="!ready || !duration"
          aria-label="再生位置"
          @pointerdown="onSeekPointerDown"
          @input="onSeekInput"
          @pointerup="onSeekPointerUp"
          @change="onSeekChange"
        >
      </div>

      <span class="time">{{ formatTime(duration) }}</span>
    </div>

    <div class="action-row">
      <button
        type="button"
        class="icon-btn"
        :disabled="!ready"
        :aria-label="playing ? '一時停止' : '再生'"
        @click="emit('toggle-play')"
      >
        <span v-if="!playing" class="play-icon">▶</span>
        <span v-else class="pause-icon">Ⅱ</span>
      </button>

      <div class="volume-group">
        <button
          type="button"
          class="icon-btn"
          :disabled="!ready"
          :aria-label="muted ? 'ミュート解除' : 'ミュート'"
          @click="emit('toggle-mute')"
        >
          {{ muted || volume === 0 ? '🔇' : '🔊' }}
        </button>

        <input
          class="volume-input"
          type="range"
          min="0"
          max="100"
          step="1"
          :value="muted ? 0 : volume"
          :disabled="!ready"
          aria-label="音量"
          @input="onVolumeInput"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  padding: 10px 12px 12px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.35) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  color: #fff;
  user-select: none;
}

.seek-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.time {
  flex: 0 0 auto;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  opacity: 0.9;
  min-width: 2.5em;
}

.seek-track {
  position: relative;
  flex: 1;
  height: 18px;
  display: flex;
  align-items: center;
}

.seek-fill {
  position: absolute;
  left: 0;
  height: 2px;
  background: #fff;
  border-radius: 1px;
  pointer-events: none;
  z-index: 1;
}

.seek-track::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 1px;
}

.seek-input {
  position: relative;
  z-index: 2;
  width: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
  height: 18px;
}

.seek-input::-webkit-slider-runnable-track {
  height: 2px;
  background: transparent;
}

.seek-input::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  margin-top: -4px;
  border-radius: 50%;
  background: #fff;
  border: none;
}

.seek-input::-moz-range-track {
  height: 2px;
  background: transparent;
}

.seek-input::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: none;
}

.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.95;
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.icon-btn:not(:disabled):hover {
  opacity: 1;
}

.play-icon {
  font-size: 13px;
  margin-left: 2px;
}

.pause-icon {
  font-size: 14px;
  letter-spacing: -0.05em;
}

.volume-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-input {
  width: 72px;
  height: 18px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.volume-input::-webkit-slider-runnable-track {
  height: 2px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 1px;
}

.volume-input::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  margin-top: -4px;
  border-radius: 50%;
  background: #fff;
  border: none;
}

.volume-input::-moz-range-track {
  height: 2px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 1px;
}

.volume-input::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: none;
}
</style>
