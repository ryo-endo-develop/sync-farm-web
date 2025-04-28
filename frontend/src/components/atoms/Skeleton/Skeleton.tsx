import React from 'react'

import * as styles from './Skeleton.css'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
  style?: React.CSSProperties // インラインスタイルも受け付ける
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%', // デフォルトは幅いっぱい
  height = '1em', // デフォルトはフォントサイズ基準
  className,
  style
}) => {
  const combinedStyle: React.CSSProperties = {
    width,
    height,
    ...style // 外部からの style をマージ
  }

  return (
    <span
      className={`${styles.skeleton} ${className || ''}`}
      style={combinedStyle}
      aria-hidden="true" // スクリーンリーダーからは隠す
    />
  )
}
