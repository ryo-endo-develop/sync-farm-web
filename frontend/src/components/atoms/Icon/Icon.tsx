import React from 'react'

import { IconProps } from './Icon.types'

export const Icon: React.FC<IconProps> = ({
  as: IconComponent, // as Prop からコンポーネントを取得
  size, // サイズ Prop
  color, // 色 Prop
  className, // 外部クラス名
  ...rest // 残りの Props (strokeWidth など)
}) => {
  // size prop が '1em' や '100%' のような相対的な単位の場合、
  // color も 'currentColor' にして親要素の色を継承させると便利な場合がある
  const iconColor = color === 'currentColor' ? undefined : color // currentColor はデフォルトの可能性もあるので調整

  return (
    <IconComponent
      size={size} // size をそのまま渡す
      color={iconColor} // color をそのまま渡す (currentColor はデフォルト挙動に任せる)
      className={className} // className をそのまま渡す
      aria-hidden="true" // 装飾的なアイコンはスクリーンリーダーから隠す
      focusable="false" // IE用フォーカス制御 (任意)
      {...rest} // 残りの Props を展開
    />
  )
}
