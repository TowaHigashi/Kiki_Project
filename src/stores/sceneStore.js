import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useSceneStore = defineStore('scene', () => {
    // ユーザーが散策中かどうかを管理するフラグ
    const isUserStrolling = ref(false)

    // モーダル表示中（オブジェクトズーム状態）かどうかを管理するフラグ
    const isModalOpen = ref(false)

    // どのオブジェクトをモーダル表示しているかを管理するフラグ
    const whichModalSelected = ref('')

    // カメラとコントロールのインスタンスを共有
    const camera = shallowRef(null)
    const controls = shallowRef(null)

    // 移動先の目標値
    const targetPosition = ref(null)
    const targetLookAt = ref(null)

    return {
        isUserStrolling,
        isModalOpen,
        whichModalSelected,
        camera,
        controls,
        targetPosition,
        targetLookAt,
    }
})