// src/components/atoms/Checkbox/Checkbox.tsx
import { Check } from 'lucide-react' // チェックマークアイコンの例
import React from 'react'

import * as styles from './Checkbox.css'
import { CheckboxProps } from './Checkbox.types'

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  id,
  name,
  className,
  ...rest
}) => {
  const checkboxBoxClassName = styles.checkboxBox({
    isChecked: checked,
    isDisabled: disabled
  })

  return (
    <label htmlFor={id} className={`${styles.container} ${className || ''}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.hiddenInput} // 実際の input は隠す
        {...rest}
      />
      {/* 見た目上のチェックボックス */}
      <span className={checkboxBoxClassName} aria-hidden="true">
        <span className={styles.checkmark}>
          {/* SVGアイコンなどを表示 */}
          <Check size="100%" strokeWidth={3} />
        </span>
      </span>
      {/* ラベルテキスト */}
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  )
}
