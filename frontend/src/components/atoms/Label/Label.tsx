import React from 'react'

import * as styles from './Label.css'
import { LabelProps } from './Label.types'

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  required = false,
  className,
  ...rest
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`${styles.label} ${className || ''}`}
      {...rest}
    >
      {children}
      {required && (
        <span className={styles.requiredIndicator} aria-hidden="true">
          *
        </span> // スクリーンリーダー向けには別途対応推奨 (aria-requiredなど)
      )}
    </label>
  )
}
