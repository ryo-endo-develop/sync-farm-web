import React from 'react'

import * as styles from './Input.css'
import { InputProps } from './Input.types'

export const Input: React.FC<InputProps> = (props) => {
  const {
    type = 'text', // デフォルト値を設定
    value,
    onChange,
    placeholder,
    disabled = false,
    isError = false,
    iconLeft,
    iconRight,
    id,
    name,
    className, // 外部クラス名
    ...rest // required, maxLength など他の input 属性
  } = props

  // recipe スタイルを適用
  const inputClassName = styles.input({
    isError,
    hasLeftIcon: !!iconLeft,
    hasRightIcon: !!iconRight
  })

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {iconLeft && (
        <span className={styles.icon.left} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={isError ? true : undefined} // エラー状態をスクリーンリーダーに伝える
        className={inputClassName}
        {...rest} // 残りの props を展開
      />
      {iconRight && (
        <span className={styles.icon.right} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </div>
  )
}
