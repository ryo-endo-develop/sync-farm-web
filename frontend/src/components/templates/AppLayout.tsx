import {
  Calendar,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Settings
} from 'lucide-react'
import React from 'react'

import { Icon } from '../atoms/Icon/Icon'
import { Header } from '../organisms/Header/Header'
import { SideNavigation } from '../organisms/SideNavigation/SideNavigation'
import { NavigationItem } from '../organisms/SideNavigation/SideNavigation.types'
import * as styles from './AppLayout.css'

// AppLayout が受け取る Props (通常は children のみ)
type AppLayoutProps = {
  children: React.ReactNode
}

const navigationItems: NavigationItem[] = [
  {
    label: 'ダッシュボード',
    icon: <Icon as={LayoutDashboard} size={20} />,
    to: '/'
  },
  { label: 'タスク', icon: <Icon as={ListChecks} size={20} />, to: '/tasks' },
  {
    label: 'カレンダー',
    icon: <Icon as={Calendar} size={20} />,
    to: '/calendar'
  },
  { label: 'メモ', icon: <Icon as={MessageSquare} size={20} />, to: '/memos' },
  { label: '設定', icon: <Icon as={Settings} size={20} />, to: '/settings' }
]

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Header コンポーネントを表示 */}
      <Header />

      {/* ナビゲーションとメインコンテンツ */}
      <div className={styles.container}>
        <SideNavigation
          items={navigationItems}
          className={styles.navPlaceholder}
        />

        {/* メインコンテンツ領域 (ページコンポーネントが表示される) */}
        <main className={styles.mainContent}>{children}</main>
      </div>
      {/* 必要であれば Footer などもここに追加 */}
    </div>
  )
}
