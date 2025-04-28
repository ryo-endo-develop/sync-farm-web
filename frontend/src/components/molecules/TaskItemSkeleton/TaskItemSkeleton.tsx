import React from 'react'
import * as styles from './TaskItemSkeleton.css'
import { Skeleton } from '../../atoms/Skeleton/Skeleton'
import { vars } from '../../../styles/theme.css'

export const TaskItemSkeleton: React.FC = () => {
  return (
    <div className={styles.skeletonContainer}>
      {/* チェックボックスのスケルトン */}
      <div className={styles.skeletonCheckbox}>
        <Skeleton
          width={vars.fontSize.md}
          height={vars.fontSize.md}
          style={{ borderRadius: vars.borderRadius.sm }}
        />
      </div>

      {/* コンテンツ部分のスケルトン */}
      <div className={styles.skeletonContent}>
        {/* タスク名 (1行目) */}
        <Skeleton
          height={vars.fontSize.md}
          width="70%"
          className={styles.skeletonTextLine}
        />
        {/* 詳細 (2行目) */}
        <div className={styles.skeletonDetails}>
          <Skeleton
            height={vars.fontSize.sm}
            width="24px"
            style={{ borderRadius: vars.borderRadius.full }}
          />{' '}
          {/* Avatar */}
          <Skeleton height={vars.fontSize.sm} width="40%" /> {/* Due Date */}
        </div>
      </div>

      {/* アクション部分のスケルトン (任意) */}
      <div className={styles.skeletonActions}>
        <Skeleton height="24px" width="24px" /> {/* Edit Button */}
        <Skeleton height="24px" width="24px" /> {/* Delete Button */}
      </div>
    </div>
  )
}
