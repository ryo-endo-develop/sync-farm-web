import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import React from 'react'

import { Avatar } from '../../atoms/Avatar/Avatar'
import * as styles from './UserMenu.css'
import { UserMenuProps } from './UserMenu.types'

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  items,
  className
}) => {
  return (
    <div className={className}>
      <DropdownMenu.Root>
        {/* トリガー: アバター */}
        <DropdownMenu.Trigger asChild>
          {/* アバターをクリック可能にし、フォーカススタイルを適用 */}
          <button
            className={styles.dropdownTrigger}
            aria-label="ユーザーメニューを開く"
          >
            <Avatar
              src={user.avatarUrl}
              initials={user.initials}
              alt={user.name}
              size="sm" // ヘッダー内なので小さめ
            />
          </button>
        </DropdownMenu.Trigger>

        {/* ポータル: ドロップダウンを body 直下などにレンダリング */}
        <DropdownMenu.Portal>
          {/* メニュー本体 */}
          <DropdownMenu.Content
            className={styles.dropdownContent}
            sideOffset={5} // トリガーからの距離
            align="end" // 右端揃え
          >
            {/* メニュー項目をループで生成 */}
            {items.map((item, index) =>
              item.isSeparator ? (
                // 区切り線
                <DropdownMenu.Separator
                  key={`separator-${index}`}
                  className={styles.dropdownSeparator}
                />
              ) : (
                // 通常のメニュー項目
                <DropdownMenu.Item
                  key={item.label} // label をキーにする (一意である前提)
                  className={styles.dropdownItem}
                  disabled={item.disabled}
                  onSelect={item.onClick} // onSelect でクリック処理を実行
                  // href={item.href} // リンクの場合は Link コンポーネントと組み合わせる必要あり
                >
                  {/* アイコン (あれば) */}
                  {item.icon && (
                    <span className={styles.itemIcon}>
                      {/* Icon Atom を使うか、直接 ReactElement を表示 */}
                      {/* <Icon as={item.icon} size={16} /> */}
                      {item.icon}
                    </span>
                  )}
                  {/* ラベル */}
                  {item.label}
                </DropdownMenu.Item>
              )
            )}
            {/* <DropdownMenu.Arrow className={styles.dropdownArrow} /> */}{' '}
            {/* 矢印 (任意) */}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
