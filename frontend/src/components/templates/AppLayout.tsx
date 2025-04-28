import React from 'react'

import { vars } from '../../styles/theme.css'
import { Header } from '../organisms/Header/Header'
import * as styles from './AppLayout.css'

// AppLayout が受け取る Props (通常は children のみ)
type AppLayoutProps = {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Header コンポーネントを表示 */}
      <Header />

      {/* ナビゲーションとメインコンテンツ */}
      <div className={styles.container}>
        {/* サイドナビゲーション (今はプレースホルダー) */}
        {/* 将来的に SideNavigation コンポーネントに置き換える */}
        <nav className={styles.navPlaceholder}>
          {/* ナビゲーションリンクなどを配置 */}
          <p style={{ color: vars.color.textSecondary }}>Nav</p> {/* 仮表示 */}
        </nav>

        {/* メインコンテンツ領域 (ページコンポーネントが表示される) */}
        <main className={styles.mainContent}>{children}</main>
      </div>
      {/* 必要であれば Footer などもここに追加 */}
    </div>
  )
}
