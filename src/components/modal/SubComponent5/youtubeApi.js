// YouTube IFrame Player API の読み込み・Player 生成 / 破棄

const SCRIPT_ID = 'youtube-iframe-api'
const SCRIPT_SRC = 'https://www.youtube.com/iframe_api'

/** @type {Promise<typeof window.YT> | null} */
let apiReadyPromise = null

/**
 * YouTube IFrame API を読み込み、利用可能になるまで待つ
 * @returns {Promise<typeof window.YT>}
 */
export function loadYoutubeApi() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window is not available'))
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT)
  }

  if (apiReadyPromise) {
    return apiReadyPromise
  }

  apiReadyPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') {
        previousCallback()
      }
      resolve(window.YT)
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = SCRIPT_SRC
      script.async = true
      script.onerror = () => {
        apiReadyPromise = null
        reject(new Error('Failed to load YouTube IFrame API'))
      }
      document.head.appendChild(script)
    }
  })

  return apiReadyPromise
}

/**
 * YouTube Player を生成する
 * @param {HTMLElement|string} elementOrId
 * @param {object} options YT.Player コンストラクタ第2引数
 * @returns {Promise<YT.Player>}
 */
export async function createPlayer(elementOrId, options) {
  const YT = await loadYoutubeApi()
  return new YT.Player(elementOrId, options)
}

/**
 * YouTube Player を破棄する
 * @param {YT.Player | null | undefined} player
 */
export function destroyPlayer(player) {
  if (player && typeof player.destroy === 'function') {
    try {
      player.destroy()
    } catch (error) {
      console.warn('YouTube Player destroy failed:', error)
    }
  }
}
