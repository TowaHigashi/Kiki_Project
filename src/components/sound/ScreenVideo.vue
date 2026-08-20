<!--
  3D 空間上のスクリーン動画。
  objects.js のメタデータでメッシュを生成し、表示・操作 UI を担当する。
  音量は soundStore.videoVolume（× masterVolume）で管理する。
-->
<script setup>
import * as THREE from 'three'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSoundStore } from '@/stores/soundStore'
import YoutubeControls from '@/components/modal/SubComponent5/YoutubeControls.vue'

const props = defineProps({
  scene: {
    type: Object,
    required: true,
  },
  objectData: {
    type: Object,
    required: true,
  },
})

const soundStore = useSoundStore()

const videoRef = ref(null)
const ready = ref(false)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const muted = ref(false)
const uiVisible = ref(false)
const uiHovered = ref(false)
const isSeeking = ref(false)
/** 実際の表示状態（フェード用）。ホバー解除後 2s で false になる */
const controlsShown = ref(false)

/** @type {THREE.Mesh | null} */
let mesh = null
/** @type {THREE.VideoTexture | null} */
let texture = null
/** @type {ReturnType<typeof setTimeout> | null} */
let hideTimer = null

/** ホバー中・UI操作中・再生中は表示を維持 */
const hoverIntent = computed(
  () =>
    uiVisible.value ||
    uiHovered.value ||
    isSeeking.value ||
    isPlaying.value
)

function clearHideTimer() {
  if (hideTimer != null) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

watch(hoverIntent, (active) => {
  if (active) {
    clearHideTimer()
    controlsShown.value = true
    return
  }

  // ホバー解除から 2s 後にフェードアウト開始
  clearHideTimer()
  hideTimer = setTimeout(() => {
    controlsShown.value = false
    hideTimer = null
  }, 2000)
})

/** YoutubeControls 向け 0–100。Store の 0–1 と相互変換 */
const uiVolume = computed(() => Math.round(soundStore.videoVolume * 100))

const effectiveVolume = computed(() => {
  if (!soundStore.videoEnabled || muted.value) return 0
  return Math.max(0, Math.min(1, soundStore.masterVolume * soundStore.videoVolume))
})

function applyVolume() {
  const video = videoRef.value
  if (!video) return
  video.volume = effectiveVolume.value
}

function setUiVisible(visible) {
  uiVisible.value = visible
}

function syncPlayingState(playing) {
  isPlaying.value = playing
  soundStore.isVideoPlaying = playing
}

// 外部（YouTube 再生開始など）から isVideoPlaying = false されたらスクリーン動画を停止
watch(
  () => soundStore.isVideoPlaying,
  (playing) => {
    if (playing) return
    const video = videoRef.value
    if (video && !video.paused) {
      video.pause()
    }
  }
)

function onLoadedMetadata() {
  const video = videoRef.value
  if (!video) return
  ready.value = true
  duration.value = video.duration || 0
  applyVolume()
}

function onTimeUpdate() {
  if (isSeeking.value) return
  const video = videoRef.value
  if (!video) return
  currentTime.value = video.currentTime || 0
}

function onPlay() {
  syncPlayingState(true)
}

function onPause() {
  syncPlayingState(false)
}

function onEnded() {
  syncPlayingState(false)
  currentTime.value = duration.value || currentTime.value
}

async function togglePlay() {
  const video = videoRef.value
  if (!video || !ready.value) return
  if (!soundStore.videoEnabled) return

  try {
    if (video.paused) {
      await video.play()
    } else {
      video.pause()
    }
  } catch (error) {
    console.warn('[ScreenVideo] play/pause failed:', error)
  }
}

function seek(time) {
  const video = videoRef.value
  if (!video || !ready.value) return
  const t = Math.max(0, Math.min(time, duration.value || time))
  video.currentTime = t
  currentTime.value = t
}

function setVolume(value) {
  const v = Math.max(0, Math.min(100, Number(value)))
  soundStore.videoVolume = v / 100
  if (v > 0 && muted.value) {
    muted.value = false
  }
  applyVolume()
}

function toggleMute() {
  muted.value = !muted.value
  applyVolume()
}

function onSeekingChange(seeking) {
  isSeeking.value = seeking
  if (!seeking) {
    onTimeUpdate()
  }
}

function update() {
  if (texture) {
    texture.needsUpdate = true
  }
}

watch(effectiveVolume, () => {
  applyVolume()
})

watch(
  () => soundStore.videoEnabled,
  (enabled) => {
    const video = videoRef.value
    if (!enabled && video && !video.paused) {
      video.pause()
    }
    applyVolume()
  }
)

onMounted(() => {
  const video = videoRef.value
  if (!video || !props.objectData?.path) return

  video.src = props.objectData.path
  video.loop = true
  video.playsInline = true
  video.preload = 'auto'
  video.crossOrigin = 'anonymous'

  video.addEventListener('loadedmetadata', onLoadedMetadata)
  video.addEventListener('timeupdate', onTimeUpdate)
  video.addEventListener('play', onPlay)
  video.addEventListener('pause', onPause)
  video.addEventListener('ended', onEnded)

  texture = new THREE.VideoTexture(video)
  texture.colorSpace = THREE.SRGBColorSpace

  // 16:9 平面。最終サイズは objectData.scale で調整
  const geometry = new THREE.PlaneGeometry(1.6, 0.9)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  })

  mesh = new THREE.Mesh(geometry, material)

  if (props.objectData.position) {
    mesh.position.set(...props.objectData.position)
  }
  if (props.objectData.rotation) {
    mesh.rotation.set(...props.objectData.rotation)
  }
  if (props.objectData.scale) {
    mesh.scale.set(...props.objectData.scale)
  }

  mesh.userData = {
    type: 'video',
    fileName: props.objectData.fileName,
    path: props.objectData.path,
    position: props.objectData.position,
    name: props.objectData.name,
    id: props.objectData.id,
    cameraFocusIn: props.objectData.cameraFocusIn,
    cameraFocusOut: props.objectData.cameraFocusOut,
  }

  props.scene?.add(mesh)
  applyVolume()
})

onBeforeUnmount(() => {
  clearHideTimer()

  const video = videoRef.value
  if (video) {
    video.pause()
    video.removeEventListener('loadedmetadata', onLoadedMetadata)
    video.removeEventListener('timeupdate', onTimeUpdate)
    video.removeEventListener('play', onPlay)
    video.removeEventListener('pause', onPause)
    video.removeEventListener('ended', onEnded)
    video.removeAttribute('src')
    video.load()
  }

  if (mesh && props.scene) {
    props.scene.remove(mesh)
    mesh.geometry?.dispose()
    if (mesh.material) {
      mesh.material.map = null
      mesh.material.dispose()
    }
  }

  texture?.dispose()
  texture = null
  mesh = null
  soundStore.isVideoPlaying = false
})

defineExpose({
  getMesh: () => mesh,
  getVideo: () => videoRef.value,
  setUiVisible,
  update,
  togglePlay,
})
</script>

<template>
  <video ref="videoRef" class="screen-video-el" playsinline />

  <div
    class="screen-video-ui"
    :class="{ 'is-visible': controlsShown }"
    @pointerenter="uiHovered = true"
    @pointerleave="uiHovered = false"
    @pointerdown.stop
    @click.stop
  >
    <YoutubeControls
      :ready="ready"
      :playing="isPlaying"
      :current-time="currentTime"
      :duration="duration"
      :volume="uiVolume"
      :muted="muted || !soundStore.videoEnabled"
      @toggle-play="togglePlay"
      @seek="seek"
      @set-volume="setVolume"
      @toggle-mute="toggleMute"
      @seeking-change="onSeekingChange"
    />
  </div>
</template>

<style scoped>
.screen-video-el {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.screen-video-ui {
  position: absolute;
  left: 11%;
  bottom: 24px;
  z-index: 20;
  width: min(240px, 90vw);
  transform: translateX(-50%);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.screen-video-ui.is-visible {
  opacity: 1;
  pointer-events: auto;
}
</style>
