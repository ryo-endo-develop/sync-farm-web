import { Bell, Menu } from 'lucide-react' // アイコン例
import React from 'react'
import { Link } from 'react-router-dom' // ロゴをリンクにする場合

import { vars } from '../../../styles/theme.css'
import { Avatar } from '../../atoms/Avatar/Avatar' // UserMenu 仮実装用
import { Button } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { Text } from '../../atoms/Text/Text' // Logo 代用
import * as styles from './Header.css'
import { HeaderProps } from './Header.types'

export const Header: React.FC<HeaderProps> = ({ className }) => {
  // TODO: 実際のユーザー情報を取得する
  const currentUser = { name: 'Test User', initials: 'TU' } // ダミーデータ

  return (
    <header className={`${styles.header} ${className || ''}`}>
      {/* --- 左側: ロゴ、(Tablet以上)ページタイトル --- */}
      <div className={styles.leftSection}>
        {/* SP 用ハンバーガーメニューボタン */}
        <div className={styles.hamburgerMenu}>
          <Button
            variant="text"
            size="sm"
            aria-label="メニューを開く"
            style={{ padding: vars.space[1] }}
          >
            <Icon as={Menu} size={24} />
          </Button>
        </div>

        {/* ロゴ (Text Atom で代用、Link にする) */}
        <Link to="/" className={styles.logo}>
          <Text as="span" fontWeight="bold" color="primary" fontSize="lg">
            SyncFam
          </Text>
        </Link>

        {/* ページタイトル (Tablet以上で表示) */}
        {/* TODO: 現在のページに応じてタイトルを動的に表示 */}
        <Text as="h1" className={styles.pageTitle}>
          タスク一覧
        </Text>
      </div>

      {/* --- 右側: 通知、ユーザーメニュー --- */}
      <div className={styles.rightSection}>
        {/* 通知ボタン (仮) */}
        <Button
          variant="text"
          size="sm"
          aria-label="通知"
          style={{ padding: vars.space[1] }}
        >
          <Icon as={Bell} size={20} />
        </Button>

        {/* ユーザーメニュー (仮: Avatar のみ) */}
        {/* TODO: UserMenu Molecule を実装して置き換える */}
        <div style={{ cursor: 'pointer' }} title={currentUser.name}>
          <Avatar
            // src={currentUser.avatarUrl} // 将来的に
            initials={currentUser.initials}
            size="sm"
            alt={`ユーザー: ${currentUser.name}`}
          />
        </div>
      </div>
    </header>
  )
}
