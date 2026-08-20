<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { descriptionSectionKeys, youtubeVideos } from './youtubeData.js'
import YoutubePlayer from './YoutubePlayer.vue'

/** モーダル内のスクロール親（ObjectInfoPanel の .info-panel）を探す */
function getScrollParent(el) {
  let parent = el?.parentElement ?? null

  while (parent) {
    const { overflowY } = getComputedStyle(parent)
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent
    }
    parent = parent.parentElement
  }

  return null
}

function revealKey(videoId, part) {
  return `${videoId}:${part}`
}

const pageRef = ref(null)
const visibleMap = reactive({})

/** @type {IntersectionObserver | null} */
let observer = null

onMounted(async () => {
  await nextTick()

  const pageEl = pageRef.value
  if (!pageEl) return

  const targets = [...pageEl.querySelectorAll('[data-reveal-key]')]
  if (!targets.length) return

  const root = getScrollParent(pageEl)

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const key = entry.target.dataset.revealKey
        if (!key) continue

        if (entry.isIntersecting) {
          // 下から入ってきたとき（または初回表示）にヌッと出現
          visibleMap[key] = true
          continue
        }

        // 交差なしのときだけ退出方向を判定
        // threshold: 0 なので「交差なし」≒ ほぼ完全に画面外
        const rootRect = entry.rootBounds
        const rect = entry.boundingClientRect
        if (!rootRect) continue

        // 下側に出た: 要素上端が root 下端より下
        const leftThroughBottom = rect.top >= rootRect.bottom
        if (leftThroughBottom) {
          visibleMap[key] = false
        }
        // 上側に出た場合は visible を維持（上スクロール復帰時は再アニメしない）
      }
    },
    {
      root,
      // グレーゾーン回避: 交差が 0 になった時点で退出判定へ
      threshold: 0,
      rootMargin: '0px 0px -8% 0px',
    }
  )

  for (const el of targets) {
    observer.observe(el)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="pageRef" class="youtube-page">
    <h1 class="page-title">YOUTUBE</h1>

    <section
      v-for="(video, index) in youtubeVideos"
      :key="video.videoId"
      class="video-block"
    >
      <h2 class="video-label">Video {{ index + 1 }}</h2>

      <div
        class="reveal-item"
        :class="{ 'is-visible': visibleMap[revealKey(video.videoId, 'player')] }"
        :data-reveal-key="revealKey(video.videoId, 'player')"
      >
        <YoutubePlayer :video-id="video.videoId" />
      </div>

      <h3
        class="reveal-item video-title"
        :class="{ 'is-visible': visibleMap[revealKey(video.videoId, 'title')] }"
        :data-reveal-key="revealKey(video.videoId, 'title')"
      >
        {{ video.title }}
      </h3>

      <div
        class="reveal-item video-description"
        :class="{ 'is-visible': visibleMap[revealKey(video.videoId, 'description')] }"
        :data-reveal-key="revealKey(video.videoId, 'description')"
      >
        <section
          v-for="sectionKey in descriptionSectionKeys"
          :key="sectionKey"
          class="desc-section"
        >
          <h4 class="desc-heading">{{ sectionKey }}</h4>
          <p
            v-for="(line, lineIndex) in video.description[sectionKey]"
            :key="`${sectionKey}-${lineIndex}`"
            class="desc-line"
          >
            {{ line }}
          </p>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.youtube-page {
  width: 100%;
  max-width: 960px;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
}

.video-block {
  margin-bottom: 48px;
}

.video-block:last-child {
  margin-bottom: 24px;
}

.reveal-item {
  opacity: 0;
  transform: translateY(40px);
  /* 出現時のみヌッと動かす（退場は瞬時に戻す） */
  transition: none;
  will-change: opacity, transform;
}

.reveal-item.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.video-label {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #666;
  text-transform: uppercase;
}

.video-title {
  margin: 16px 0 8px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

.video-description {
  margin: 8px 0 0;
  color: #333;
}

.desc-section {
  margin: 0 0 20px;
}

.desc-section:last-child {
  margin-bottom: 0;
}

.desc-heading {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #111;
}

.desc-line {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #333;
}
</style>
