import React from 'react'

import type { Task } from '../../../generated/api'
import { RoutineTaskItem } from '../../molecules/RoutineTaskItem/RoutineTaskItem'
import * as styles from './RoutineTaskList.css'

interface RoutineTaskListProps {
  tasks: Task[]
}

export const RoutineTaskList: React.FC<RoutineTaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>今日のルーティンタスクはありません。</div>
    )
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li key={task.id} className={styles.listItem}>
          <RoutineTaskItem task={task} />
        </li>
      ))}
    </ul>
  )
}
