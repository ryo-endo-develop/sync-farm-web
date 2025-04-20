// src/components/atoms/Text/Text.tsx
import React from 'react'

import { sprinkles } from '../../../styles/sprinkles.css' // sprinkles 関数をインポート
import * as styles from './Text.css' // Text 固有のスタイル
import { TextProps } from './Text.types'

export const Text: React.FC<TextProps> = ({
  as: Component = 'p', // デフォルトは 'p' タグ
  children,
  // sprinkles の Props を分割代入で受け取る (例)
  // もしくは rest props に含めて一括で渡す
  fontSize,
  fontWeight,
  lineHeight,
  color,
  textAlign,
  padding,
  paddingX,
  paddingY, // ショートハンドも使える
  margin,
  marginX,
  marginY,
  // ... 他の sprinkles プロパティ
  // 外部からの className を受け取る場合は結合処理が必要
  // className: externalClassName,
  ...rest // sprinkles props + その他の HTML 属性
}) => {
  // sprinkles の props をフィルタリングして sprinkles 関数に渡す
  // (手動で分割代入するより、専用の関数を作ると便利)
  // ここでは簡略化のため、主要なものを直接渡し、残りを rest に含める想定
  const sprinkleProps: Parameters<typeof sprinkles>[0] = {
    fontSize,
    fontWeight,
    lineHeight,
    color,
    textAlign,
    padding,
    paddingX,
    paddingY,
    margin,
    marginX,
    marginY
    // ... 他の sprinkles プロパティをここに追加
  }

  // sprinkles 関数を使ってクラス名を生成
  const sprinkleClassName = sprinkles(sprinkleProps)

  // Text 固有のクラス名と結合
  // TODO: as の値に応じて headingStyle などを追加するロジック (任意)
  const componentClassName = `${styles.textBase} ${sprinkleClassName}`
  // ${externalClassName || ''}`; // 外部 className があれば結合

  return (
    <Component className={componentClassName} {...rest}>
      {children}
    </Component>
  )
}

// -- sprinkles の Props をフィルタリングするヘルパー関数の例 (オプション) --
// const splitProps = (props: Record<string, any>) => {
//   const sprinkleProps: Record<string, any> = {};
//   const otherProps: Record<string, any> = {};
//   for (const key in props) {
//     if (sprinkles.properties.has(key)) { // sprinkles で定義されたプロパティかチェック
//       sprinkleProps[key] = props[key];
//     } else {
//       otherProps[key] = props[key];
//     }
//   }
//   return { sprinkleProps, otherProps };
// };
