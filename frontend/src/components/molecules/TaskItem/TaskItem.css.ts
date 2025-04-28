import { style, styleVariants } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

export const container = recipe({
  base: {
    display: 'flex', // 横並びレイアウト
    alignItems: 'center', // 垂直方向中央揃え
    // 上下の padding を増やし、左右も少し設定
    padding: `${vars.space[3]} ${vars.space[4]}`, // 例: 縦12px, 横16px
    gap: vars.space[3], // 要素間のデフォルト間隔 (12px)
    borderBottom: `1px solid ${vars.color.border}`, // 下線
    transition: 'background-color 0.1s ease-out', // ホバー効果用
    cursor: 'default', // 通常はデフォルトカーソル

    ':last-child': {
      borderBottom: 'none' // 最後の項目は下線を消す
    },
    // ホバー時の背景色 (任意)
    ':hover': {
      backgroundColor: `color-mix(in srgb, ${vars.color.primary} 5%, ${vars.color.surface} 95%)`
    }
  },
  variants: {
    isCompleted: {
      true: {
        // 完了時は少し背景色を変えるなど (任意)
        // backgroundColor: vars.color.surface,
      }
    }
  },
  defaultVariants: {
    isCompleted: false
  }
})

// チェックボックスを囲むラッパー
export const checkboxWrapper = style({
  // display: 'flex', // 中身の位置調整が必要な場合
  // alignItems: 'center',
  flexShrink: 0 // コンテンツが長くても縮まないように
})

// タスク名と詳細情報を含む中央のコンテンツエリア
export const content = style({
  flexGrow: 1, // 残りのスペースをすべて使う
  display: 'flex',
  flexDirection: 'column', // タスク名と詳細を縦に並べる
  gap: vars.space[1], // タスク名と詳細の間のわずかなスペース (4px)
  minWidth: 0 // これがないと flex アイテムが内容に合わせて縮小せず、text-overflow が効かない場合がある
})

// タスク名テキストのスタイル (recipe で完了状態を管理)
export const taskName = recipe({
  base: {
    fontSize: vars.fontSize.md, // 基準フォントサイズ
    fontWeight: vars.fontWeight.medium, // 少し太め
    color: vars.color.textPrimary, // 主要テキスト色
    whiteSpace: 'nowrap', // 折り返さない
    overflow: 'hidden', // はみ出しを隠す
    textOverflow: 'ellipsis', // 省略記号 (...)
    transition: 'color 0.2s ease-out, text-decoration 0.2s ease-out',
    lineHeight: vars.lineHeight.tight // 行間を少し詰める
  },
  variants: {
    isCompleted: {
      true: {
        color: vars.color.textSecondary, // 少し薄い色に
        textDecoration: 'line-through' // 打ち消し線
      }
    }
  },
  defaultVariants: {
    isCompleted: false
  }
})

// 詳細情報 (担当者、期限日) を表示するエリア
export const details = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3], // アバターと期限日の間隔 (12px)
  fontSize: vars.fontSize.sm, // 小さめのフォントサイズ
  color: vars.color.textSecondary // 薄めのテキスト色
})

// 期限日テキストのスタイルバリアント
export const dueDate = styleVariants({
  default: {
    display: 'inline-flex', // アイコンとテキストを揃える
    alignItems: 'center',
    gap: vars.space[1] // アイコンとテキストの間隔 (4px)
  },
  overdue: {
    // 期限切れの場合
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    color: vars.color.error, // エラーカラー
    fontWeight: vars.fontWeight.medium // 少し太字に
  }
})

// アクションボタン (編集/削除) を表示するエリア
export const actions = style({
  marginLeft: 'auto', // 右端に寄せる
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1], // ボタン間の隙間
  flexShrink: 0
})

// (オプション) 削除ボタンの色などを調整する場合
export const deleteButton = style({
  color: vars.color.textSecondary, // 通常は薄めの色
  ':hover': {
    color: vars.color.error, // ホバー時にエラーカラーに
    backgroundColor: `color-mix(in srgb, ${vars.color.error} 10%, transparent 90%)`
  }
})

// (オプション) 編集ボタンの色などを調整する場合
export const editButton = style({
  color: vars.color.textSecondary,
  ':hover': {
    color: vars.color.primary, // ホバー時にプライマリカラーに
    backgroundColor: `color-mix(in srgb, ${vars.color.primary} 10%, transparent 90%)`
  }
})
