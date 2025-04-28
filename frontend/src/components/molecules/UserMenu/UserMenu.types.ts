import type React from 'react'

// ユーザー情報の型 (Header などから渡される想定)
export type UserInfo = {
  name: string
  initials: string // Avatar 用
  avatarUrl?: string | null // Avatar 用 (任意)
  // email?: string; // 必要なら追加
}

// メニュー項目の型
export type MenuItem = {
  label: string // 表示テキスト
  icon?: React.ReactElement // アイコン (Icon Atom を想定)
  onClick?: () => void // クリック時の処理
  isSeparator?: boolean // 区切り線かどうかのフラグ
  disabled?: boolean // 無効化フラグ
  // href?: string; // リンクにする場合
}

// UserMenu コンポーネントの Props
export type UserMenuProps = {
  user: UserInfo // 表示するユーザー情報
  items: MenuItem[] // ドロップダウンメニューの項目リスト
  className?: string // 外部スタイル用
}
