import React from 'react'

import * as styles from './Avatar.css'
import { AvatarProps } from './Avatar.types'

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  size = 'md',
  alt = '', // デフォルトの alt を空文字に
  className,
  ...rest
}) => {
  const avatarClassName = styles.avatar({ size })

  // src が有効な場合に alt テキストを設定 (なければイニシャルを代替テキストに)
  const imageAlt = src ? alt || `Avatar for ${initials}` : ''

  return (
    // src があれば img、なければイニシャル表示用の div をレンダリング
    src ? (
      <img
        src={src}
        alt={imageAlt}
        className={`${avatarClassName} ${styles.image} ${className || ''}`}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} // 型アサーション
      />
    ) : (
      <div
        className={`${avatarClassName} ${className || ''}`}
        role="img" // 画像がない場合は role="img" を指定
        aria-label={alt || `Avatar for ${initials}`} // アクセシビリティのため aria-label を設定
        {...(rest as React.HTMLAttributes<HTMLDivElement>)} // 型アサーション
      >
        {/* イニシャルを表示 (例: 最初の2文字) */}
        {initials?.substring(0, 2).toUpperCase()}
      </div>
    )
  )
}
