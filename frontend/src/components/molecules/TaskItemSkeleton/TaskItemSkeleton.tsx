import React from 'react'

import { vars } from '../../../styles/theme.css'
import { Skeleton } from '../../atoms/Skeleton/Skeleton'
import * as styles from './TaskItemSkeleton.css'

export const TaskItemSkeleton: React.FC = () => {
  return (
    // skeletonContainer スタイルを適用した div 要素
    <div className={styles.skeletonContainer}>
      {/* チェックボックス部分のスケルトン */}
      <div className={styles.skeletonCheckbox}>
        {/* Skeleton Atom でチェックボックスの形状を模倣 */}
        <Skeleton
          width={vars.fontSize.md} // チェックボックスの幅 (例: 16px)
          height={vars.fontSize.md} // チェックボックスの高さ (例: 16px)
          style={{ borderRadius: vars.borderRadius.sm }} // 少し角丸にする
        />
      </div>

      {/* コンテンツエリア全体のスケルトン */}
      <div className={styles.skeletonContentWrapper}>
        {/* メイン情報ライン (アバター、名前、日付) のスケルトン */}
        <div className={styles.skeletonMainInfo}>
          {/* アバター部分のスケルトン */}
          <div className={styles.skeletonAvatar}>
            {/* Skeleton Atom でアバターの形状 (円形) を模倣 */}
            <Skeleton
              width="24px" // アバターの幅 (TaskItem に合わせる)
              height="24px" // アバターの高さ
              style={{ borderRadius: vars.borderRadius.full }} // 完全な円にする
            />
          </div>
          {/* タスク名部分のスケルトン */}
          <div className={styles.skeletonTaskName}>
            {/* Skeleton Atom でテキスト行を模倣 */}
            <Skeleton
              height={vars.fontSize.md} // タスク名のフォントサイズに合わせる
              width="70%" // 幅は適当に設定 (例: 70%)
            />
          </div>
          {/* 期限日部分のスケルトン */}
          <div className={styles.skeletonDueDate}>
            {/* Skeleton Atom でテキスト行を模倣 */}
            <Skeleton
              height={vars.fontSize.sm} // 期限日のフォントサイズに合わせる
              width="80px" // 幅は適当に設定 (例: 80px)
            />
          </div>
        </div>

        {/* ラベル表示エリアのスケルトン (任意) */}
        <div className={styles.skeletonLabelsWrapper}>
          {/* 複数の短い Skeleton でラベルバッジを模倣 */}
          <Skeleton
            height={vars.fontSize.xs} // バッジの高さに合わせる
            width="50px" // バッジの幅 (適当)
            style={{
              borderRadius: vars.borderRadius.full,
              marginRight: vars.space[1]
            }} // 角丸と右マージン
          />
          <Skeleton
            height={vars.fontSize.xs}
            width="60px"
            style={{ borderRadius: vars.borderRadius.full }}
          />
        </div>
      </div>

      {/* アクション部分のスケルトン */}
      <div className={styles.skeletonActions}>
        {/* Skeleton Atom でボタンアイコンを模倣 */}
        <Skeleton height="24px" width="24px" /> {/* 編集ボタン用 */}
        <Skeleton height="24px" width="24px" /> {/* 削除ボタン用 */}
      </div>
    </div>
  )
}
