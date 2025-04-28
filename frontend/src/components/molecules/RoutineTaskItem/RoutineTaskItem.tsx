import React, { useEffect,useState } from 'react'

import type { Task } from '../../../generated/api'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Text } from '../../atoms/Text/Text'
import * as styles from './RoutineTaskItem.css'

const TextAtom = Text

interface RoutineTaskItemProps {
  task: Task
}

export const RoutineTaskItem: React.FC<RoutineTaskItemProps> = ({ task }) => {
  // ★ 完了状態を内部 State で管理
  const [isLocallyCompleted, setIsLocallyCompleted] = useState(task.isCompleted)

  // task.isCompleted が変わったら State も更新 (任意: 親からの再レンダリング追従)
  useEffect(() => {
    setIsLocallyCompleted(task.isCompleted)
  }, [task.isCompleted])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLocallyCompleted(event.target.checked)
    // ここでは API を呼び出さない
    console.log(
      `Routine task ${task.id} completion toggled to ${event.target.checked} (local state)`
    )
  }

  const taskNameClassName = styles.taskName({ isCompleted: isLocallyCompleted })

  return (
    <div className={styles.container}>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          id={`routine-${task.id}`}
          checked={isLocallyCompleted}
          onChange={handleCheckboxChange}
          aria-label={`ルーティンタスク ${task.name} を${isLocallyCompleted ? '未完了' : '完了'}にする`}
        />
      </div>
      <TextAtom className={taskNameClassName}>{task.name}</TextAtom>
    </div>
  )
}
