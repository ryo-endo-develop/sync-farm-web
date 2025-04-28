import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'
// TaskItem のスタイルを一部流用・参照
import {
  container,
  checkboxWrapper,
  contentWrapper,
  mainInfo,
  avatarWrapper,
  dueDateWrapper,
  actions
} from '../TaskItem/TaskItem.css'

// TaskItem のコンテナスタイルを流用
export const skeletonContainer = style([
  container({ isCompleted: false }), // 基本のコンテナスタイル
  {
    cursor: 'default',
    pointerEvents: 'none', // クリックできないように
    ':hover': {
      // ホバー効果なし
      backgroundColor: 'transparent'
    }
  }
])

// コンテンツエリア全体のスケルトン (TaskItem.contentWrapper に合わせる)
export const skeletonContentWrapper = style([contentWrapper])

// チェックボックス部分のスケルトン
export const skeletonCheckbox = style([
  checkboxWrapper, // レイアウトを合わせる
  {
    // Skeleton Atom に直接スタイルを適用する
  }
])

// コンテンツ部分のスケルトン
export const skeletonContent = style([
  contentWrapper, // レイアウトを合わせる
  {
    // 必要なら調整
  }
])

// メイン情報ラインのスケルトン (TaskItem.mainInfo に合わせる)
export const skeletonMainInfo = style([mainInfo])

// アバター部分のスケルトン (TaskItem.avatarWrapper に合わせる)
export const skeletonAvatar = style([avatarWrapper])

// タスク名部分のスケルトン (幅を調整)
export const skeletonTaskName = style({
  flexGrow: 1, // 伸びるように
  minWidth: 0
})

// 期限日部分のスケルトン (TaskItem.dueDateWrapper に合わせる)
export const skeletonDueDate = style([dueDateWrapper])

// ラベル表示エリアのスケルトン (任意)
export const skeletonLabelsWrapper = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[1],
  marginTop: vars.space[1] // 上の要素とのマージン
})

// アクション部分のスケルトン
export const skeletonActions = style([
  actions, // レイアウトを合わせる
  {
    // 必要なら調整
  }
])

// 1行のテキストスケルトン用 (TaskItemSkeleton.tsx で使用)
export const skeletonTextLine = style({
  // 必要ならスタイル追加
})
