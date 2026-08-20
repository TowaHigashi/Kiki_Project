<!-- 動画プレイヤーの表示・YouTube API 接続・独自 UI への状態提供 -->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { createPlayer, destroyPlayer } from './youtubeApi.js'
import YoutubeControls from './YoutubeControls.vue'
import { useSoundStore } from '@/stores/soundStore'

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
})

const soundStore = useSoundStore()

const hostRef = ref(null)
const ready = ref(false)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(100)
const muted = ref(false)
const uiVisible = ref(false)
const isSeeking = ref(false)

/** @type {any} */
let player = null
let destroyed = false
/** @type {ReturnType<typeof setInterval> | null} */
let pollTimer = null

const showControls = computed(() => uiVisible.value || isSeeking.value)

function stopPolling() {
  if (pollTimer != null) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function syncFromPlayer() {
  if (!player || typeof player.getCurrentTime !== 'function') return

  try {
    if (!isSeeking.value) {
      currentTime.value = player.getCurrentTime() || 0
    }
    const d = player.getDuration?.() || 0
    if (d > 0) duration.value = d
    if (typeof player.getVolume === 'function') {
      volume.value = player.getVolume()
    }
    if (typeof player.isMuted === 'function') {
      muted.value = player.isMuted()
    }
  } catch {
    // destroy 直後などは無視
  }
}

function startPolling() {
  stopPolling()
  syncFromPlayer()
  pollTimer = setInterval(syncFromPlayer, 250)
}

function disableCaptions() {
  if (!player) return
  try {
    // 公式に「字幕オフ強制」はない。HTML5 向けの非公式だが実効しやすい手段
    player.unloadModule?.('captions')
    player.unloadModule?.('cc')
  } catch {
    // 失敗しても再生自体には影響させない
  }
}

function onPlayerStateChange(event) {
  const state = event.data
  const YT = window.YT
  if (!YT?.PlayerState) return

  // 再生開始時に字幕モジュールを外す（自動字幕が出るケース向け）
  if (
    state === YT.PlayerState.PLAYING ||
    state === YT.PlayerState.BUFFERING
  ) {
    disableCaptions()
  }

  if (state === YT.PlayerState.PLAYING) {
    isPlaying.value = true
    // Environment Duck ON（YouTube 側）。先に立ててからスクリーン停止フラグを落とす
    soundStore.isYoutubePlaying = true
    soundStore.isVideoPlaying = false
    startPolling()
  } else if (
    state === YT.PlayerState.PAUSED ||
    state === YT.PlayerState.ENDED ||
    state === YT.PlayerState.CUED
  ) {
    isPlaying.value = false
    // 停止 / 終了 → Environment Duck OFF（isVideoPlaying は true に戻さない）
    soundStore.isYoutubePlaying = false
    stopPolling()
    syncFromPlayer()
    if (state === YT.PlayerState.ENDED) {
      currentTime.value = duration.value || currentTime.value
    }
  }
}

function onPlayerReady() {
  if (destroyed) return
  ready.value = true
  disableCaptions()
  syncFromPlayer()
}

onMounted(async () => {
  if (!props.videoId || !hostRef.value) return

  try {
    player = await createPlayer(hostRef.value, {
      videoId: props.videoId,
      width: '100%',
      height: '100%',
      // 現行 IFrame Player API で有効なパラメータのみ使用
      // modestbranding / showinfo 等の非推奨パラメータは使わない
      playerVars: {
        autoplay: 0,
        controls: 0, // 標準コントロールバーを非表示
        disablekb: 1,
        fs: 0,
        playsinline: 1,
        rel: 0,
        iv_load_policy: 3, // アノテーション非表示
        // cc_load_policy は「1で強制表示」のみ公式サポート。
        // 0 での強制オフは公式に効かないため指定しない。
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    })

    if (destroyed) {
      destroyPlayer(player)
      player = null
    }
  } catch (error) {
    console.error('YouTube Player creation failed:', error)
  }
})

onBeforeUnmount(() => {
  destroyed = true
  soundStore.isYoutubePlaying = false
  stopPolling()
  destroyPlayer(player)
  player = null
})

function togglePlay() {
  if (!player || !ready.value) return
  if (isPlaying.value) {
    player.pauseVideo()
  } else {
    player.playVideo()
  }
}

function seek(time) {
  if (!player || !ready.value) return
  const t = Math.max(0, Math.min(time, duration.value || time))
  currentTime.value = t
  player.seekTo(t, true)
}

function setVolume(value) {
  if (!player || !ready.value) return
  const v = Math.max(0, Math.min(100, Number(value)))
  volume.value = v
  player.setVolume(v)
  if (v > 0 && muted.value) {
    player.unMute()
    muted.value = false
  }
}

function toggleMute() {
  if (!player || !ready.value) return
  if (muted.value) {
    player.unMute()
    muted.value = false
  } else {
    player.mute()
    muted.value = true
  }
}

function onSeekingChange(seeking) {
  isSeeking.value = seeking
  if (!seeking) {
    syncFromPlayer()
  }
}
</script>

<template>
  <div
    class="player-shell"
    @mouseenter="uiVisible = true"
    @mouseleave="uiVisible = false"
  >
    <div class="player-wrapper" @click="togglePlay">
      <div ref="hostRef" class="player-host" />
    </div>

    <YoutubeControls
      class="controls-layer"
      :class="{ 'is-visible': showControls }"
      :ready="ready"
      :playing="isPlaying"
      :current-time="currentTime"
      :duration="duration"
      :volume="volume"
      :muted="muted"
      @toggle-play="togglePlay"
      @seek="seek"
      @set-volume="setVolume"
      @toggle-mute="toggleMute"
      @seeking-change="onSeekingChange"
    />
  </div>
</template>

<style scoped>
.player-shell {
  position: relative;
  width: 100%;
  background: #000;
}

.player-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  cursor: pointer;
}

.player-host {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* 標準 UI 非表示 + ホバーを shell で受け取る */
.player-wrapper :deep(iframe) {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  border: 0;
  pointer-events: none;
}

.controls-layer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.controls-layer.is-visible {
  opacity: 1;
  pointer-events: auto;
}
</style>
