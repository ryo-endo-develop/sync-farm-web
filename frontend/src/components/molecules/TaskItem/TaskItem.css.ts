import { style, styleVariants } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

export const container = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    padding: `${vars.space[2]} ${vars.space[3]}`, // 上下左右のパディング
    gap: vars.space[3], // 要素間のスペース
    borderBottom: `1px solid ${vars.color.border}`,
    transition: 'background-color 0.1s ease-out',
    ':last-child': {
      borderBottom: 'none'
    }
    // ':hover': { // ホバー効果 (任意)
    //   backgroundColor: `color-mix(in srgb, ${vars.color.primary} 5%, transparent 95%)`,
    // }
  },
  variants: {
    isCompleted: {
      true: {
        // backgroundColor: `color-mix(in srgb, ${vars.color.border} 20%, transparent 80%)`, // 背景を少し変えるなど
      }
    }
  },
  defaultVariants: {
    isCompleted: false
  }
})

export const checkboxWrapper = style({
  // チェックボックス自体のスタイルは Checkbox Atom に依存
  flexShrink: 0 // 縮まないように
})

export const content = style({
  flexGrow: 1, // 残りのスペースを埋める
  display: 'flex',
  flexDirection: 'column', // タスク名と詳細を縦に並べる場合
  gap: vars.space[1], // タスク名と詳細の間隔
  overflow: 'hidden' // はみ出したテキストを隠す
})

export const taskName = recipe({
  base: {
    fontSize: vars.fontSize.md,
    color: vars.color.textPrimary,
    whiteSpace: 'nowrap', // 折り返さない
    overflow: 'hidden', // はみ出しを隠す
    textOverflow: 'ellipsis', // 省略記号(...)
    transition: 'color 0.2s ease-out, text-decoration 0.2s ease-out'
  },
  variants: {
    isCompleted: {
      true: {
        color: vars.color.textSecondary,
        textDecoration: 'line-through' // 打ち消し線
      }
    }
  },
  defaultVariants: {
    isCompleted: false
  }
})

export const details = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary
})

export const dueDate = styleVariants({
  default: {},
  overdue: {
    // 期限切れの場合のスタイル (オプション)
    color: vars.color.error,
    fontWeight: vars.fontWeight.medium
  }
})

export const avatarPlaceholder = style({
  // Avatar Atom ができるまでの仮スタイル
  width: '24px',
  height: '24px',
  borderRadius: vars.borderRadius.full,
  backgroundColor: vars.color.border,
  fontSize: vars.fontSize.xs,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textSecondary,
  flexShrink: 0
})

export const actions = style({
  marginLeft: 'auto', // 右端に寄せる
  display: 'flex',
  alignItems: 'center', // ボタンの高さを揃える
  gap: vars.space[1], // ボタン間の隙間 (狭め)
  flexShrink: 0 // コンテナが縮んでもボタンが潰れないように
})

// (オプション) 削除ボタンの色などを調整する場合
export const deleteButton = style({
  color: vars.color.error, // アイコンの色をエラーカラーに
  ':hover': {
    backgroundColor: `color-mix(in srgb, ${vars.color.error} 10%, transparent 90%)` // ホバー背景
  }
})
