import { ChevronDown } from 'lucide-react' // 下向き矢印アイコンの例
import React from 'react'

import * as styles from './Select.css'
import { SelectProps } from './Select.types'

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  isError = false,
  id,
  name,
  className,
  ...rest
}) => {
  const selectClassName = styles.select({ isError })

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <select
        id={id}
        name={name}
        value={value ?? ''} // value が undefined の場合は空文字にする
        onChange={onChange}
        disabled={disabled}
        className={selectClassName}
        aria-invalid={isError ? true : undefined}
        {...rest}
      >
        {/* プレースホルダー用の選択肢 */}
        {placeholder && (
          <option value="" disabled={value !== undefined && value !== ''}>
            {placeholder}
          </option>
        )}
        {/* options 配列から選択肢を生成 */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {/* 矢印アイコン */}
      <span className={styles.icon} aria-hidden="true">
        <ChevronDown size="1.2em" />
      </span>
    </div>
  )
}
