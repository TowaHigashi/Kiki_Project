import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/** 減衰倍率（1.0 = 減衰なし） */
const MASTER_DUCK_LEVEL = 0.7
const ENVIRONMENT_DUCK_LEVEL = 0.7
const VIDEO_DUCK_LEVEL = 0.7

export const useSoundStore = defineStore('sound', () => {
    // サイト全体の基本音量
    const masterVolume = ref(0.8)
    // 環境音の基本音量
    const environmentVolume = ref(0.6)
    // スクリーンでの動画の基本音量
    const videoVolume = ref(0.8)
    // 環境音の有効/無効
    const environmentEnabled = ref(true)
    // スクリーン音の有効/無効
    const videoEnabled = ref(true)
    // Masterに一時的な減衰をかけるための値
    const masterDucker = ref(1.0)
    // 環境音に一時的な減衰をかけるための値
    const environmentDucker = ref(1.0)
    // スクリーン音に一時的な減衰をかけるための値
    const videoDucker = ref(1.0)
    // スクリーン音が再生中かどうか
    const isVideoPlaying = ref(false)
    // YouTube が再生中かどうか
    const isYoutubePlaying = ref(false)

    // スクリーン動画 or YouTube 再生中は Environment Duck ON → 環境音を一時減衰
    watch(
        [isVideoPlaying, isYoutubePlaying],
        ([videoPlaying, youtubePlaying]) => {
            environmentDucker.value =
                videoPlaying || youtubePlaying ? ENVIRONMENT_DUCK_LEVEL : 1.0
        }
    )

    return {
        masterVolume,
        environmentVolume,
        videoVolume,
        environmentEnabled,
        videoEnabled,
        masterDucker,
        environmentDucker,
        videoDucker,
        isVideoPlaying,
        isYoutubePlaying,
    }
})
