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

  const containerClassName = `${styles.labelContainer} ${className || ''}`

  return (
    <label
      htmlFor={id} // input と紐付け
      className={containerClassName} // スタイルクラスを適用
      data-disabled={disabled} // ★ CSS で無効状態を判別するための data 属性
    >
      {/* 実際の input 要素はスタイルで隠す */}
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.hiddenInput} // 隠すスタイルを適用
        {...rest} // 残りの input 属性を展開
      />
      {/* ★ 見た目上のチェックボックスボックス */}
      <span className={checkboxBoxClassName} aria-hidden="true">
        {/* ★ チェックマーク */}
        <span className={styles.checkmark}>
          {/* チェックマークアイコン (lucide-react を使用) */}
          <Check size="100%" strokeWidth={3} />
        </span>
      </span>
      {/* ラベルテキスト (label prop があれば表示) */}
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  )
}
