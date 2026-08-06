import { watch } from 'vue'

export function useCameraBlurrer({ container, sceneStore }) {
    if (!container) return { destroy: () => { } }

    // 少しずつ変化させるため、CSSのtransitionを設定
    container.style.transition = 'filter 0.5s ease-in-out'

    // sceneStore.isModalOpen と sceneStore.whichModalSelected の両方を監視
    const unwatch = watch(
        () => ({
            isOpen: sceneStore.isModalOpen,
            id: sceneStore.whichModalSelected
        }),
        ({ isOpen, id }) => {
            // モーダルが開いていて、かつIDが2001/2007でない場合のみグレーアウト
            if (isOpen && ![2001, 2002, 2003, 2004, 2005, 2006, 2007].includes(id)) {
                container.style.filter = 'grayscale(0.8)'
                console.log('開発用ログ: グレーにしましたisOpen(true)')
            } else {
                container.style.filter = 'grayscale(0)'
                console.log('開発用ログ: もとに戻しましたisOpen(false)')
            }
        },
        { immediate: true }
    )

    return {
        destroy: () => {
            unwatch()
            if (container) {
                container.style.filter = ''
                container.style.transition = ''
            }
        }
    }
}

// TODO
// ①どうしてもblurを入れたい場合は、CSSではなく Three.jsネイティブの「ポストプロセッシング（EffectComposer）」を使うといい（導入がめんどい）
// ②モーダル表示を使用する時と同じタイミングで使用するので制御をまとめた方がすっきりするかも