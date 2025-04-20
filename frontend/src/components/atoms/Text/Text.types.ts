import type React from 'react'

import type { Sprinkles } from '../../../styles/sprinkles.css'

// Text コンポーネントが受け付ける HTML タグ (拡張可能)
type AsProp =
  | 'p'
  | 'span'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'label'
  | 'strong'
  | 'em'

// Text コンポーネントの Props
export type TextProps = {
  as?: AsProp // どの HTML 要素としてレンダリングするか (デフォルト 'p')
  children: React.ReactNode
  // className?: string; // sprinkles を使う場合、外部 className は sprinkles と結合する必要あり
  // ↑ sprinkles の Props と統合するため、className ではなく sprinkles の Props を直接受け取る
} & Sprinkles & // sprinkles で定義した Props をすべて受け入れる
  Omit<React.HTMLAttributes<HTMLElement>, 'color'> // sprinkes の color と衝突するため HTML の color を除外
// 必要に応じて他の HTML 属性も Omit
