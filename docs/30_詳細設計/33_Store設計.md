# 3-3. Store設計

## 概要

共有状態は Pinia で管理する。

| Store | ファイル | 役割 |
|-------|----------|------|
| `sceneStore` | `src/stores/sceneStore.js` | 探索・モーダル・カメラ共有 |
| `soundStore` | `src/stores/soundStore.js` | 音量・Duck・再生フラグ（5.3 / 5.11） |

いずれも setup store 形式。actions / getters は設けず、`ref` を直接読み書きする。

画面モードが増えた場合は `sceneStore` に追加するか、肥大化したら分割を検討する。

---

## sceneStore（実装済）

| キー | 型（実行時） | 初期値 | 説明 |
|------|--------------|--------|------|
| `isUserStrolling` | `boolean` | `false` | 初期位置から離れているか（BackButton1） |
| `isModalOpen` | `boolean` | `false` | モーダル表示中（5.10） |
| `whichModalSelected` | `number \| '' \| null` | `''` | 選択中オブジェクト id |
| `camera` | `PerspectiveCamera \| null` | `null` | 共有カメラ |
| `controls` | `OrbitControls \| null` | `null` | 共有コントロール |
| `targetPosition` | `Vector3 \| null` | `null` | カメラ lerp 目標 |
| `targetLookAt` | `Vector3 \| null` | `null` | 注視点 lerp 目標 |

---

## soundStore（実装済・5.3 / 5.11）

| キー | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| `masterVolume` | `number` (0–1) | `0.8` | サイト全体の基本音量 |
| `environmentVolume` | `number` (0–1) | `0.6` | 環境音の基本音量 |
| `videoVolume` | `number` (0–1) | `0.8` | スクリーン動画の基本音量 |
| `environmentEnabled` | `boolean` | `true` | 環境音の有効 / 無効 |
| `videoEnabled` | `boolean` | `true` | スクリーン音の有効 / 無効 |
| `masterDucker` | `number` | `1.0` | Master への一時減衰（現状は主に将来用。環境音式には乗算） |
| `environmentDucker` | `number` | `1.0` | 環境音への一時減衰（Duck で自動更新） |
| `videoDucker` | `number` | `1.0` | スクリーン音への一時減衰（将来用） |
| `isVideoPlaying` | `boolean` | `false` | スクリーン動画が再生中か |
| `isYoutubePlaying` | `boolean` | `false` | YouTube が再生中か |

### Duck 自動更新

```text
isVideoPlaying || isYoutubePlaying
  → environmentDucker = ENVIRONMENT_DUCK_LEVEL（減衰 ON）
それ以外
  → environmentDucker = 1.0（OFF）
```

Store は `HTMLAudioElement.play()` 等を呼ばない。再生は `AmbientAudio` / `ScreenVideo` / `YoutubePlayer` が担当する。

---

## 追加予定の状態（要件対応）

### 導線・UI（5.8 / 5.10 / シナリオ）

| キー（案） | 要件 | 説明 |
|------------|------|------|
| `loadingProgress` / `isAssetsReady` | 5.8 | 読込進捗・完了。未完了時は探索不可 |
| `hasStarted` / `isStartVisible` | シナリオ | スタート画面 |
| `isMenuOpen` | 5.10 | メニュー |
| `isHelpOpen` | 5.10 | ヘルプ |
| `isCreditsOpen` | 5.10 | クレジット（メニュー経由の場合） |

※ 音量設定 UI は `SoundSetting` がローカル開閉 + `soundStore` の値で足りている（`isSettingsOpen` は未使用）。

### 設定値（5.11・未実装分）

| キー（案） | 要件 | 説明 |
|------------|------|------|
| `isBgmOn` | 5.11 | BGM ON/OFF |
| `isFullscreen` | 5.11 | フルスクリーン |

### 体験・演出（5.5 / 5.6 / 5.9）

| キー（案） | 要件 | 説明 |
|------------|------|------|
| `activeInteraction` | 5.5 | 実行中インタラクション |
| `isPlayingEffect` / `activeEffectId` | 5.9 | オブジェクト / 時間演出の再生中 |
| `currentBgmId` | 5.9 / 5.3 | 状況に応じた BGM トラック |

重要なゲートは「読込完了 → スタート → 探索」。音量は `soundStore` と `SoundSetting` / 再生コンポーネントが共有する。

---

## 更新するモジュール（現状）

| 状態 | 主な更新元 |
|------|------------|
| `isUserStrolling` | `useStrollingDetection` |
| `isModalOpen` | `InteractionManager` / `BackButton2` |
| `whichModalSelected` | `InteractionManager` / `SlideBottun` / `BackButton2` |
| `camera` / `controls` | `SceneCanvas` |
| `targetPosition` / `targetLookAt` | `CameraController2` / `BackButton1` |
| `masterVolume` 等の音量 | `SoundSetting` |
| `isVideoPlaying` | `ScreenVideo`（YouTube 開始時は `YoutubePlayer` が `false` に） |
| `isYoutubePlaying` | `YoutubePlayer` |
| `environmentDucker` | `soundStore` 内 watch |

---

## 監視する UI / 再生側（現状）

| 対象 | 監視する状態 |
|------|----------------|
| `BackButton1` | `isUserStrolling` |
| `BackButton2` | `isModalOpen` |
| `SlideBottun` | `isModalOpen` / `whichModalSelected` |
| `ObjectInfoPanel` | `isModalOpen` / `whichModalSelected` |
| `AmbientAudio` | `masterVolume` / `environmentVolume` / Duck / `environmentEnabled` |
| `ScreenVideo` | `masterVolume` / `videoVolume` / `videoEnabled` / `isVideoPlaying` |
| `SoundSetting` | 音量 3 種（双方向） |

---

## 設計上の注意

- `camera` / `controls` は `shallowRef`
- 作品メタデータ・環境音定義・演出定義は Store に置かず `objects.js` / `ambientSounds.js`（および将来の演出データ）へ
- 音量の「設定」と「再生」を分離する（Store ≠ AudioElement）
