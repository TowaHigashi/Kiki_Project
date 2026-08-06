# 3-3. Store設計

## 概要

共有状態は Pinia の **`sceneStore`**（`src/stores/sceneStore.js`）のみで管理する。  
setup store（Composition API 形式）で定義し、actions / getters は設けず、各モジュールが `ref` を直接読み書きする。

ローディング・スタート・ナビなど画面モードが増えた場合は、同一 Store に追加するか、関心が増えた時点で Store 分割を検討する。

---

## 状態一覧（実装済）

| キー | 型（実行時） | 初期値 | 説明 |
|------|--------------|--------|------|
| `isUserStrolling` | `boolean` | `false` | カメラが初期位置（id:1001）から閾値以上離れているか。`true` で BackButton1 を表示 |
| `isModalOpen` | `boolean` | `false` | オブジェクトフォーカス（モーダル）中か |
| `whichModalSelected` | `number \| '' \| null` | `''` | 選択中オブジェクトの `id`。閉じると `null` |
| `camera` | `THREE.PerspectiveCamera \| null` | `null` | SceneCanvas がセットする共有カメラ |
| `controls` | `OrbitControls \| null` | `null` | SceneCanvas がセットする共有コントロール |
| `targetPosition` | `THREE.Vector3 \| null` | `null` | カメラ lerp の目標位置 |
| `targetLookAt` | `THREE.Vector3 \| null` | `null` | 注視点 lerp の目標 |

---

## 追加予定の状態（要件対応）

| キー（案） | 要件 | 説明 |
|------------|------|------|
| `loadingProgress` / `isAssetsReady` | 5.8 | 読込進捗と完了フラグ。未完了時は探索開始不可 |
| `hasStarted` / `isStartVisible` | シナリオ | スタート画面の表示・開始済み |
| `isHelpOpen` | 5.7 | 操作案内パネルの開閉 |
| `isBgmOn` | 5.3 | BGM 再生状態 |
| `activeInteraction` / `isPlayingEffect` | 5.5 / 5.6 | オブジェクト別演出・カメラ演出の再生中フラグ |

名前は実装時に調整してよい。重要なのは「読込完了 → スタート → 探索」のゲートを Store で一元管理すること。

---

## 更新するモジュール（現状）

| 状態 | 主な更新元 |
|------|------------|
| `isUserStrolling` | `useStrollingDetection`（毎フレーム）。モーダル中は強制 `false` |
| `isModalOpen` | `InteractionManager`（開く）、`BackButton2`（閉じる） |
| `whichModalSelected` | `InteractionManager`、`SlideBottun`、`BackButton2` |
| `camera` / `controls` | `SceneCanvas`（`onMounted`） |
| `targetPosition` / `targetLookAt` | `CameraController2.moveCamera`、`BackButton1` |

---

## 監視する UI（現状）

| UI | 監視する状態 |
|----|----------------|
| `BackButton1` | `isUserStrolling` |
| `BackButton2` | `isModalOpen` |
| `SlideBottun` | `isModalOpen` / `whichModalSelected` |
| `ObjectInfoPanel` | `isModalOpen` / `whichModalSelected` |

---

## 設計上の注意

- `camera` / `controls` は Three.js インスタンスのため `shallowRef` を使用している
- UI と描画の橋渡し以外の業務データは Store に置かない（作品メタデータ・インタラクション定義は `objects.js`）
