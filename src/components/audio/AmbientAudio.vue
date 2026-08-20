<!--
  環境音の再生担当（UI なし）。
  状態・設定は soundStore、定義は ambientSounds。
  初回ユーザー操作で再生を開始する（ページ表示直後の自動再生はしない）。
-->
<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useSoundStore } from '@/stores/soundStore'
import { ambientSounds } from '@/data/ambientSounds'

const soundStore = useSoundStore()

/** @type {Map<string, HTMLAudioElement>} */
const audioElements = new Map()

/** play() で再生要求中の id（enabled 復帰時の再開用） */
const requestedIds = new Set()

/** 初回ユーザー操作による開始を一度だけ行う */
let hasRequestedStart = false

/** 実効音量 = masterVolume × masterDucker × environmentVolume × environmentDucker */
const effectiveVolume = computed(() => {
  const volume =
    soundStore.masterVolume *
    soundStore.masterDucker *
    soundStore.environmentVolume *
    soundStore.environmentDucker
  return Math.max(0, Math.min(1, volume))
})

function bindAudioRef(id, el) {
  if (el) {
    audioElements.set(id, el)
  } else {
    audioElements.delete(id)
  }
}

function resolveIds(id) {
  if (id) return [id]
  return ambientSounds.map((sound) => sound.id)
}

function applyVolume(id) {
  const volume = effectiveVolume.value
  for (const targetId of resolveIds(id)) {
    const audio = audioElements.get(targetId)
    if (audio) audio.volume = volume
  }
}

/**
 * 環境音を再生する。
 * @param {string} [id] 省略時は定義済みの全環境音
 */
async function play(id) {
  for (const targetId of resolveIds(id)) {
    requestedIds.add(targetId)
  }

  if (!soundStore.environmentEnabled) return

  applyVolume(id)

  for (const targetId of resolveIds(id)) {
    const audio = audioElements.get(targetId)
    if (!audio) continue
    // 既に再生中なら重複 play しない
    if (!audio.paused) continue

    try {
      await audio.play()
    } catch (error) {
      console.warn(`[AmbientAudio] play failed (${targetId}):`, error)
    }
  }
}

/**
 * 環境音を停止する（pause）。位置は維持。
 * @param {string} [id] 省略時は定義済みの全環境音
 */
function pause(id) {
  for (const targetId of resolveIds(id)) {
    requestedIds.delete(targetId)
    const audio = audioElements.get(targetId)
    if (audio) audio.pause()
  }
}

function startOnFirstGesture() {
  if (hasRequestedStart) return
  hasRequestedStart = true

  play()
  window.removeEventListener('pointerdown', startOnFirstGesture)
}

watch(effectiveVolume, () => {
  applyVolume()
})

watch(
  () => soundStore.environmentEnabled,
  async (enabled) => {
    if (!enabled) {
      for (const audio of audioElements.values()) {
        audio.pause()
      }
      return
    }

    if (requestedIds.size === 0) return

    applyVolume()
    for (const targetId of [...requestedIds]) {
      const audio = audioElements.get(targetId)
      if (!audio) continue
      if (!audio.paused) continue
      try {
        await audio.play()
      } catch (error) {
        console.warn(`[AmbientAudio] play failed (${targetId}):`, error)
      }
    }
  }
)

onMounted(() => {
  // StartPage 未実装のため、サイト上の最初の pointerdown を開始トリガーにする
  window.addEventListener('pointerdown', startOnFirstGesture)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', startOnFirstGesture)
  for (const audio of audioElements.values()) {
    audio.pause()
  }
  audioElements.clear()
  requestedIds.clear()
})

defineExpose({
  play,
  pause,
})
</script>

<template>
  <audio
    v-for="sound in ambientSounds"
    :key="sound.id"
    :ref="(el) => bindAudioRef(sound.id, el)"
    :src="sound.src"
    :loop="sound.loop !== false"
    preload="auto"
  />
</template>
