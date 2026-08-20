// YouTube動画IDやタイトル等のメタデータ
// YouTube関連情報は SubComponent5 配下で完結させる（objects.js には追加しない）

/**
 * youtu.be / watch?v= 形式の URL から videoId を取り出す
 * @param {string} url
 * @returns {string}
 */
export function extractVideoId(url) {
  if (!url) return ''

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace(/^\//, '').split('/')[0] || ''
    }
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v') || ''
    }
    const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/)
    if (embedMatch) return embedMatch[1]
  } catch {
    // URL でない場合は videoId そのものとみなす
    return url
  }

  return ''
}

/** 表示順を固定するためのキー一覧 */
export const descriptionSectionKeys = [
  'DATE',
  'TYPE',
  'CONCEPT',
  'COMMENT',
  'CREDIT',
]

const videoSources = [
  {
    url: 'https://youtu.be/BZbk2oBLq4M?si=L9hjLgNQG3ZqVQIp',
    title: '女郎蜘蛛',
    description: {
      DATE: ['2024/08/16'],
      TYPE: ['Music Video'],
      CONCEPT: ['作品の意図・制作背景'],
      COMMENT: [
        'この作品／動画を制作した背景や、',
        '制作時に考えていたことなど。',
      ],
      CREDIT: [
        'Composition / Vocal / Movie / Mix : 紀紀',
        'Illustration : CRYBORG',
        'Mastering : 柴晃浩',
      ],
    },
  },
  {
    url: 'https://youtu.be/XDmx-ioYWfk?si=fe73OgXRaKSR3TmW',
    title: 'パンドラ',
    description: {
      DATE: ['2024/08/16'],
      TYPE: ['Music Video'],
      CONCEPT: ['作品の意図・制作背景'],
      COMMENT: [
        'この作品／動画を制作した背景や、',
        '制作時に考えていたことなど。',
      ],
      CREDIT: [
        'Composition / Vocal / Movie / Mix : 紀紀',
        'Illustration : CRYBORG',
        'Mastering : 柴晃浩',
      ],
    },
  },
  {
    url: 'https://youtu.be/SQXOyip3boA?si=s3iknBhs3229hixs',
    title: '爪痕',
    description: {
      DATE: ['2024/08/16'],
      TYPE: ['Music Video'],
      CONCEPT: ['作品の意図・制作背景'],
      COMMENT: [
        'この作品／動画を制作した背景や、',
        '制作時に考えていたことなど。',
      ],
      CREDIT: [
        'Composition / Vocal / Movie / Mix : 紀紀',
        'Illustration : CRYBORG',
        'Mastering : 柴晃浩',
      ],
    },
  },
]

export const youtubeVideos = videoSources.map((item) => ({
  videoId: extractVideoId(item.url),
  title: item.title,
  description: item.description,
}))
