// 3D 空間上のスクリーン動画に対するクリック / ホバー操作
// クリック判定は useRaycaster を使用する

import { useRaycaster } from '@/composables/useRaycaster'

/**
 * @param {object} options
 * @param {HTMLElement} options.container
 * @param {import('three').Scene} options.scene
 * @param {import('three').Camera} options.camera
 * @param {{ x: number, y: number }} options.mouse
 * @param {() => import('three').Object3D | null} options.getMesh
 * @param {() => HTMLVideoElement | null} options.getVideo
 * @param {(visible: boolean) => void} [options.onHoverChange]
 * @param {() => boolean} [options.canPlay] videoEnabled 等のゲート
 */
export function useScreenVideoControls({
  container,
  scene,
  camera,
  mouse,
  getMesh,
  getVideo,
  onHoverChange,
  canPlay,
}) {
  const { cast } = useRaycaster()

  let startX = 0
  let startY = 0
  let isDragging = false
  const DRAG_THRESHOLD = 5

  function findVideoHit() {
    const mesh = getMesh?.()
    if (!mesh) return null

    const intersects = cast({
      mouse,
      camera,
      objects: scene.children,
    })

    for (const hit of intersects) {
      let obj = hit.object
      while (obj) {
        if (obj === mesh || obj.userData?.type === 'video') {
          return hit
        }
        obj = obj.parent
      }
    }
    return null
  }

  function updateMouseFromEvent(event) {
    const rect = container.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  function handlePointerDown(event) {
    updateMouseFromEvent(event)
    startX = event.clientX
    startY = event.clientY
    isDragging = false
  }

  function handlePointerMove(event) {
    updateMouseFromEvent(event)
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > DRAG_THRESHOLD) {
      isDragging = true
    }

    const hit = findVideoHit()
    onHoverChange?.(Boolean(hit))
  }

  async function handleClick(event) {
    updateMouseFromEvent(event)
    if (isDragging) return

    const hit = findVideoHit()
    if (!hit) return

    if (canPlay && !canPlay()) return

    const video = getVideo?.()
    if (!video) return

    try {
      if (video.paused) {
        await video.play()
      } else {
        video.pause()
      }
    } catch (error) {
      console.warn('[useScreenVideoControls] play/pause failed:', error)
    }
  }

  container.addEventListener('pointerdown', handlePointerDown)
  container.addEventListener('pointermove', handlePointerMove)
  container.addEventListener('click', handleClick)

  const destroy = () => {
    container.removeEventListener('pointerdown', handlePointerDown)
    container.removeEventListener('pointermove', handlePointerMove)
    container.removeEventListener('click', handleClick)
    onHoverChange?.(false)
  }

  return {
    destroy,
  }
}
