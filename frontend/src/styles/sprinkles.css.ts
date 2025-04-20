import { createSprinkles,defineProperties } from '@vanilla-extract/sprinkles'

import { vars } from './theme.css'

// sprinkles で管理したい CSS プロパティと値を定義
const responsiveProperties = defineProperties({
  conditions: {
    sp: {}, // スマートフォン (今は条件なしで全画面共通)
    tablet: { '@media': 'screen and (min-width: 600px)' }, // タブレット以上
    pc: { '@media': 'screen and (min-width: 1024px)' } // PC以上
  },
  defaultCondition: 'sp', // デフォルトの条件 (モバイルファースト)
  properties: {
    // 必要に応じて display, flex, grid 関連のプロパティを追加
    display: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid'],
    flexDirection: ['row', 'column'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between'],
    gap: vars.space, // theme.css.ts で定義した space を使う
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    // 他のレイアウト関連プロパティ (width, height など) も必要なら追加
    textAlign: ['left', 'center', 'right']
  },
  shorthands: {
    // よく使う組み合わせのショートハンド (任意)
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom']
  }
})

// 色やタイポグラフィなど、レスポンシブ対応が不要なプロパティ
const unresponsiveProperties = defineProperties({
  properties: {
    fontSize: vars.fontSize,
    fontWeight: vars.fontWeight,
    lineHeight: vars.lineHeight,
    color: vars.color, // テキストカラー用
    backgroundColor: vars.color, // 背景色用
    borderRadius: vars.borderRadius,
    borderWidth: { '1': '1px', '2': '2px' }, // 例
    borderColor: vars.color
    // textDecoration: ['none', 'underline', 'line-through'], // Text Atom で直接扱うかも
    // whiteSpace: ['normal', 'nowrap'],
    // overflow: ['hidden', 'visible', 'auto', 'scroll'],
    // textOverflow: ['ellipsis', 'clip'],
  }
})

// sprinkles 関数を作成
export const sprinkles = createSprinkles(
  responsiveProperties,
  unresponsiveProperties
)

// sprinkles 関数の型をエクスポート (コンポーネントの Props で使う)
export type Sprinkles = Parameters<typeof sprinkles>[0]
