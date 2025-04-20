import React from 'react'

import * as styles from './Button.css'
import { ButtonProps } from './Button.types'

export const Button: React.FC<ButtonProps> = (props) => {
  // Props を分割代入し、デフォルト値を設定
  const {
    variant = 'primary',
    size = 'md',
    type = 'button',
    onClick,
    disabled = false,
    isLoading = false,
    iconLeft,
    iconRight,
    children,
    className, // 外部からのクラス名を受け取る
    ...rest // その他のHTML属性 (aria-labelなど)
  } = props

  // ローディング中はボタンを無効化
  const isDisabled = disabled || isLoading

  // recipe スタイルを適用 (スタイル定義は変更なし)
  const buttonClassName = styles.button({
    variant,
    size,
    isLoading,
    hasLeftIcon: !!iconLeft,
    hasRightIcon: !!iconRight
  })

  return (
    <button
      type={type}
      className={`${buttonClassName} ${styles.iconSpacing} ${className || ''}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && (
        <span className={styles.iconWrapper}>
          <span className={styles.spinner} />
        </span>
      )}
      {!isLoading && iconLeft && (
        <span className={styles.iconWrapper}>{iconLeft}</span>
      )}
      {/* children が文字列以外の場合も考慮 */}
      {typeof children === 'string' ? <span>{children}</span> : children}
      {!isLoading && iconRight && (
        <span className={styles.iconWrapper}>{iconRight}</span>
      )}
    </button>
  )
}
