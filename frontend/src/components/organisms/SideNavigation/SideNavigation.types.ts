import type React from 'react'

// ナビゲーションリンクの項目を表す型
export type NavigationItem = {
  label: string // 表示テキスト
  icon: React.ReactElement // 表示するアイコン (Icon Atom を想定)
  to: string // react-router-dom の NavLink に渡すパス
  // end?: boolean; // NavLink の end prop (完全一致を要求する場合)
}

// SideNavigation コンポーネントの Props
export type SideNavigationProps = {
  items: NavigationItem[] // ナビゲーション項目のリスト
  // isCollapsed?: boolean; // Tablet モードでアイコンのみ表示するかどうかのフラグ (CSSで制御するなら不要)
  className?: string // 外部スタイル用
}
