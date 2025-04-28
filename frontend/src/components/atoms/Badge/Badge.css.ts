import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

// Badge スタイルを recipe で定義
export const badge = recipe({
  base: {
    display: 'inline-flex', // インライン要素として表示
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vars.borderRadius.full, // 完全な角丸 (ピル形状)
    padding: `${vars.space[1]} ${vars.space[2]}`, // 縦4px, 横8px のパディング
    fontSize: vars.fontSize.xs, // 小さいフォントサイズ (12px)
    fontWeight: vars.fontWeight.medium,
    lineHeight: vars.lineHeight.none, // 行間を詰める
    whiteSpace: 'nowrap', // 折り返さない
    textTransform: 'uppercase' // 大文字にする (任意)
  },

  variants: {
    // カラースキーマに応じた背景色と文字色
    colorScheme: {
      primary: {
        backgroundColor: `color-mix(in srgb, ${vars.color.primary} 20%, transparent 80%)`, // 薄いプライマリ背景
        color: vars.color.primary // プライマリテキスト色
      },
      secondary: {
        backgroundColor: `color-mix(in srgb, ${vars.color.secondary} 20%, transparent 80%)`,
        color: `color-mix(in srgb, ${vars.color.secondary} 80%, ${vars.color.black} 20%)` // 少し暗めのセカンダリ色
      },
      accent: {
        backgroundColor: `color-mix(in srgb, ${vars.color.accent} 20%, transparent 80%)`,
        color: `color-mix(in srgb, ${vars.color.accent} 80%, ${vars.color.black} 20%)` // 少し暗めのアクセント色
      },
      error: {
        backgroundColor: `color-mix(in srgb, ${vars.color.error} 15%, transparent 85%)`,
        color: vars.color.error
      },
      gray: {
        backgroundColor: vars.color.surface, // Surface 色 (薄いグレー系)
        color: vars.color.textSecondary, // 薄めのテキスト色
        border: `1px solid ${vars.color.border}` // 境界線をつける (任意)
      }
    }
  },

  // デフォルトのカラースキーマ
  defaultVariants: {
    colorScheme: 'gray'
  }
})

// RecipeVariants 型をエクスポート
export type BadgeVariants = RecipeVariants<typeof badge>
