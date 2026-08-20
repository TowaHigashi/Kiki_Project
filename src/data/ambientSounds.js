// 環境音の静的定義（objects.js と同様、データ駆動で拡張する）
// STEP 2: 再生に使うのは id / src / loop。それ以外は将来用の受け皿。

/**
 * @typedef {Object} AmbientSoundDef
 * @property {string} id
 * @property {string} src public 配下のパス
 * @property {'environment'} type
 * @property {boolean} [loop=true]
 * @property {string|null} [source] 将来: 発生源キー（例 'ocean'）
 * @property {{ x: number, y: number, z: number }|null} [position] 将来: 3D 発生源座標（今回は音量計算に未使用）
 */

/** @type {AmbientSoundDef[]} */
export const ambientSounds = [
  {
    id: 'ocean',
    src: '/audio/ambient/VSQSE_1046_wave_28.mp3',
    type: 'environment',
    loop: true,
    source: null,
    position: null,
  },
]
