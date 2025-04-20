// src/components/atoms/Button/Button.css.ts
import { keyframes, style } from '@vanilla-extract/css'
import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css' // path は環境に合わせて調整してください

// ローディングスピナー用のスタイル（仮）
const spinAnimation = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
})

export const spinner = style({
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: '2px solid currentColor',
  borderRadius: '50%',
  width: '1em',
  height: '1em',
  display: 'inline-block',
  animationName: spinAnimation, // 定義したキーフレーム名を指定
  animationDuration: '1s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite'
  // animation: `${spinAnimation} 1s linear infinite`, // ショートハンドは使わない方が安全かも
})

// ボタンのスタイルを recipe で定義
export const button = recipe({
  // ベースとなる共通スタイル
  base: {
    display: 'inline-flex', // アイコンとテキストを横並びにするため
    alignItems: 'center', // アイコンとテキストを垂直方向中央揃え
    justifyContent: 'center', // テキストやアイコンを水平方向中央揃え
    border: '1px solid transparent', // デフォルトのボーダー、variantで上書き
    borderRadius: vars.borderRadius.md, // 角丸 (中) をデフォルトに
    fontWeight: vars.fontWeight.medium, // 文字の太さ
    cursor: 'pointer', // カーソルをポインターに
    // スムーズな見た目変化のためのトランジション
    transition:
      'background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out',
    fontFamily: vars.font.body, // フォントファミリーを指定
    lineHeight: vars.lineHeight.none, // ボタン内の予期せぬ余白を防ぐ
    textDecoration: 'none', // リンクとして使う場合の下線を消す
    userSelect: 'none', // テキスト選択を不可に (任意)
    whiteSpace: 'nowrap', // テキストの折り返しを防ぐ (任意)

    // 無効状態のスタイル
    ':disabled': {
      cursor: 'not-allowed', // 禁止カーソル
      opacity: 0.6 // 少し透明にする
    },
    // キーボード操作時のフォーカススタイル
    ':focus': {
      // :focus だとクリック時にも表示される
      outline: 'none' // デフォルトのアウトラインを消す場合
    },
    ':focus-visible': {
      // キーボード操作 (Tabキーなど) でフォーカスした場合のみ表示
      outline: `3px solid ${vars.color.primary}`, // 太めのフォーカスリング
      outlineOffset: '1px' // 要素との間に少し隙間を空ける
      // box-shadow でも表現可能: `0 0 0 3px color-mix(in srgb, ${vars.color.primary} 50%, transparent 50%)`
    }
  },

  // Props の値に応じたスタイルのバリアント
  variants: {
    // 見た目のバリアント (variant prop)
    variant: {
      primary: {
        backgroundColor: vars.color.primary,
        color: vars.color.white, // 白文字
        ':hover:not(:disabled)': {
          // ホバー時 (無効でない場合)
          backgroundColor: `color-mix(in srgb, ${vars.color.primary} 90%, ${vars.color.black} 10%)` // 少し暗く
        },
        ':active:not(:disabled)': {
          // クリック時 (無効でない場合)
          backgroundColor: `color-mix(in srgb, ${vars.color.primary} 80%, ${vars.color.black} 20%)` // さらに暗く
        }
      },
      secondary: {
        backgroundColor: vars.color.secondary,
        color: vars.color.textPrimary, // 文字色はテーマに合わせて調整
        ':hover:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.secondary} 90%, ${vars.color.black} 10%)`
        },
        ':active:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.secondary} 80%, ${vars.color.black} 20%)`
        }
      },
      outline: {
        backgroundColor: 'transparent', // 背景透明
        color: vars.color.primary, // 文字色はプライマリカラー
        borderColor: vars.color.primary, // ボーダーはプライマリカラー
        ':hover:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.primary} 10%, transparent 90%)` // 背景を薄くプライマリ色に
        },
        ':active:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.primary} 20%, transparent 80%)`
        }
      },
      text: {
        backgroundColor: 'transparent', // 背景透明
        color: vars.color.textPrimary, // 文字色は通常のテキスト色
        borderColor: 'transparent', // ボーダーなし
        ':hover:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.border} 50%, transparent 50%)` // 背景を薄いグレーに
        },
        ':active:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.border} 70%, transparent 30%)`
        }
      },
      danger: {
        backgroundColor: vars.color.error, // エラー色
        color: vars.color.white, // 白文字
        ':hover:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.error} 90%, ${vars.color.black} 10%)`
        },
        ':active:not(:disabled)': {
          backgroundColor: `color-mix(in srgb, ${vars.color.error} 80%, ${vars.color.black} 20%)`
        }
      }
    },
    // サイズのバリアント (size prop)
    size: {
      sm: {
        fontSize: vars.fontSize.sm, // 小さいフォントサイズ
        // 縦横のpaddingでサイズ感を調整
        paddingTop: vars.space[1], // 4px
        paddingBottom: vars.space[1], // 4px
        paddingLeft: vars.space[2], // 8px
        paddingRight: vars.space[2] // 8px
        // 必要に応じて height も指定 (line-height + padding + border)
        // height: `calc(${vars.fontSize.sm} * ${vars.lineHeight.normal} + ${vars.space[1]} * 2 + 2px)`,
      },
      md: {
        fontSize: vars.fontSize.md, // 中 (基準) フォントサイズ
        paddingTop: vars.space[2], // 8px
        paddingBottom: vars.space[2], // 8px
        paddingLeft: vars.space[4], // 16px
        paddingRight: vars.space[4] // 16px
        // height: `calc(${vars.fontSize.md} * ${vars.lineHeight.normal} + ${vars.space[2]} * 2 + 2px)`,
      },
      lg: {
        fontSize: vars.fontSize.lg, // 大きいフォントサイズ
        paddingTop: vars.space[3], // 12px
        paddingBottom: vars.space[3], // 12px
        paddingLeft: vars.space[6], // 24px
        paddingRight: vars.space[6] // 24px
        // height: `calc(${vars.fontSize.lg} * ${vars.lineHeight.normal} + ${vars.space[3]} * 2 + 2px)`,
      }
    },
    // ローディング状態 (isLoading prop)
    isLoading: {
      true: {
        opacity: 0.8, // 少し透明にする
        cursor: 'wait' // 待機カーソル
      }
    },
    // アイコン有無 (hasLeftIcon/hasRightIcon prop) - padding調整用
    // size ごとに調整が必要な場合があるため compoundVariants での調整も考慮
    hasLeftIcon: {
      true: {
        // paddingLeft: vars.space[3] // 例: 左アイコンがある場合は左paddingを少し調整
      }
    },
    hasRightIcon: {
      true: {
        // paddingRight: vars.space[3] // 例: 右アイコンがある場合は右paddingを少し調整
      }
    }
  },

  // 複数のバリアントが組み合わさった場合のスタイル
  compoundVariants: [
    // 例: variant='text' かつ size='sm' の場合の padding をさらに小さくする
    {
      variants: { variant: 'text', size: 'sm' },
      style: { paddingLeft: vars.space[1], paddingRight: vars.space[1] }
    },
    {
      variants: { variant: 'text', size: 'md' },
      style: { paddingLeft: vars.space[2], paddingRight: vars.space[2] }
    },
    {
      variants: { variant: 'text', size: 'lg' },
      style: { paddingLeft: vars.space[3], paddingRight: vars.space[3] }
    },
    // 例: size=sm で左アイコンがある場合の paddingLeft 調整
    {
      variants: { size: 'sm', hasLeftIcon: true },
      style: { paddingLeft: vars.space[1] }
    },
    // 例: size=sm で右アイコンがある場合の paddingRight 調整
    {
      variants: { size: 'sm', hasRightIcon: true },
      style: { paddingRight: vars.space[1] }
    },
    // 他の size についても同様に追加...
    {
      variants: { size: 'md', hasLeftIcon: true },
      style: { paddingLeft: vars.space[3] }
    },
    {
      variants: { size: 'md', hasRightIcon: true },
      style: { paddingRight: vars.space[3] }
    },
    {
      variants: { size: 'lg', hasLeftIcon: true },
      style: { paddingLeft: vars.space[4] }
    },
    {
      variants: { size: 'lg', hasRightIcon: true },
      style: { paddingRight: vars.space[4] }
    }
  ],

  // Props が指定されなかった場合のデフォルトのバリアント
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

// RecipeVariants 型をエクスポートしておくと、他のコンポーネントで型を利用したい場合に便利
export type ButtonVariants = RecipeVariants<typeof button>

// アイコン要素をラップするスタイル (サイズやマージン調整用)
export const iconWrapper = style({
  display: 'inline-flex', // flexアイテムとして扱う
  alignSelf: 'center' // ボタンの高さの中央に配置
  // アイコン自体のサイズは、渡されるアイコンコンポーネント側で指定するか、
  // ここで font-size に連動させる (例: `width: '1em', height: '1em'`)
})

// アイコンとテキストの間隔を制御するスタイル
export const iconSpacing = style({
  // ボタン要素直下で、テキスト(span想定)とアイコン(iconWrapper)の間のマージンを設定
  // :has セレクタを使わずに、より単純な隣接セレクタ(+)を使う
  selectors: {
    // 左アイコン + テキスト の場合
    [`& ${iconWrapper}:first-child + span`]: {
      marginLeft: vars.space[2] // size=md の場合の間隔例
    },
    // テキスト + 右アイコン の場合
    [`& span + ${iconWrapper}:last-child`]: {
      marginLeft: vars.space[2] // size=md の場合の間隔例
    },
    // 左アイコン + 右アイコン (テキストなし) の場合 - スペース不要
    [`& ${iconWrapper}:first-child + ${iconWrapper}:last-child`]: {
      marginLeft: 0
    }
  }
  // サイズごとに間隔を変える場合は、recipe の compoundVariants で調整する方が良いかも
})
