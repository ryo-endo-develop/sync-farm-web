import React from 'react'

import * as styles from './Textarea.css'
import { TextareaProps } from './Textarea.types'

export const Textarea: React.FC<TextareaProps> = (props) => {
  const {
    value,
    onChange,
    placeholder,
    disabled = false,
    isError = false,
    rows = 3, // デフォルトの行数
    id,
    name,
    className,
    ...rest
  } = props

  const textareaClassName = styles.textarea({ isError })

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      aria-invalid={isError ? true : undefined}
      className={`${textareaClassName} ${className || ''}`}
      {...rest}
    />
  )
}
