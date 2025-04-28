import React from 'react'

import * as styles from './Badge.css'
import { BadgeProps } from './Badge.types'

export const Badge: React.FC<BadgeProps> = ({
  colorScheme = 'gray', // デフォルト値を設定
  children,
  className,
  ...rest // span の他の属性
}) => {
  // recipe からクラス名を取得
  const badgeClassName = styles.badge({ colorScheme })

  return (
    // span 要素でレンダリング
    <span className={`${badgeClassName} ${className || ''}`} {...rest}>
      {children}
    </span>
  )
}
