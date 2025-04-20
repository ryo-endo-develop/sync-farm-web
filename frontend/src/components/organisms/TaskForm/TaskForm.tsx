import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import {
  CreateTaskFormData,
  CreateTaskFormSchema
} from '../../../schemas/taskSchema'
import { Button } from '../../atoms/Button/Button'
import { Input } from '../../atoms/Input/Input'
import { Label } from '../../atoms/Label/Label'
import { Text } from '../../atoms/Text/Text'
import * as styles from './TaskForm.css'
import { TaskFormProps } from './TaskForm.types'

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm<CreateTaskFormData>({
    // ★ 型引数に CreateTaskFormData を指定
    resolver: zodResolver(CreateTaskFormSchema), // ★ Zod スキーマでバリデーション
    defaultValues: { name: '', assigneeId: '', dueDate: '' } // defaultValues は空文字が良い場合も
  })

  const handleValidSubmit: SubmitHandler<CreateTaskFormData> = async (data) => {
    try {
      await onSubmit(data) // 親から渡された onSubmit を実行
    } catch (error) {
      console.error('onSubmit failed:', error)
      // 必要であれば、ここでフォームエラーを設定するなどの処理を追加
      // 例: setError('root.serverError', { type: 'manual', message: '送信に失敗しました' });
      // このエラーをユーザーに表示する仕組みも別途必要
    }
  }

  const submitting = isLoading || isSubmitting

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(handleValidSubmit)} className={styles.form}>
      {/* タスク名 */}
      <div className={styles.formField}>
        <Label htmlFor="taskName" required>
          タスク名
        </Label>
        <Controller
          name="name" // 登録するフィールド名
          control={control} // useForm から取得した control を渡す
          render={(
            { field, fieldState } // render prop で Input をレンダリング
          ) => (
            <Input
              id="taskName"
              {...field} // ★ field オブジェクトを展開 (value, onChange, onBlur, ref, name が渡される)
              isError={!!fieldState.error} // fieldState からエラー状態を取得
              disabled={submitting}
              placeholder="例: 会議資料の作成"
              aria-describedby={fieldState.error ? 'taskName-error' : undefined}
            />
          )}
        />
        {errors.name && (
          <Text
            id="taskName-error"
            fontSize="sm"
            color="error"
            className={styles.errorMessage}
            role="alert"
          >
            {' '}
            {/* role="alert" 追加 */}
            {errors.name.message}
          </Text>
        )}
      </div>

      {/* 担当者ID */}
      <div className={styles.formField}>
        <Label htmlFor="assigneeId">担当者ID (仮)</Label>
        <Controller
          name="assigneeId" // ★ フィールド名
          control={control}
          render={({ field, fieldState }) => (
            <Input
              id="assigneeId"
              {...field} // ★ field オブジェクトを展開
              value={field.value ?? ''}
              isError={!!fieldState.error}
              disabled={submitting}
              placeholder="例: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (空欄可)"
              aria-describedby={
                fieldState.error ? 'assigneeId-error' : undefined
              }
            />
          )}
        />
        {errors.assigneeId && (
          <Text
            id="assigneeId-error"
            fontSize="sm"
            color="error"
            className={styles.errorMessage}
            role="alert"
          >
            {errors.assigneeId.message}
          </Text>
        )}
      </div>

      {/* 期限日 */}
      <div className={styles.formField}>
        <Label htmlFor="dueDate">期限日 (YYYY-MM-DD)</Label>
        <Controller
          name="dueDate" // ★ フィールド名
          control={control}
          render={({ field, fieldState }) => (
            <Input
              id="dueDate"
              type="date"
              {...field} // ★ field オブジェクトを展開
              value={field.value ?? ''} // ★ date 型 input は value が null だとエラーになることがあるため空文字にフォールバック
              isError={!!fieldState.error}
              disabled={submitting}
              aria-describedby={fieldState.error ? 'dueDate-error' : undefined}
            />
          )}
        />
        {errors.dueDate && (
          <Text
            id="dueDate-error"
            fontSize="sm"
            color="error"
            className={styles.errorMessage}
            role="alert"
          >
            {errors.dueDate.message}
          </Text>
        )}
      </div>

      {/* ボタン */}
      <div className={styles.buttonGroup}>
        {onCancel && (
          <Button
            type="button"
            variant="text"
            onClick={onCancel}
            disabled={submitting}
          >
            キャンセル
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={submitting}
          disabled={submitting}
        >
          作成
        </Button>
      </div>
    </form>
  )
}
