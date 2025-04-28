import { zodResolver } from '@hookform/resolvers/zod'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger
} from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import {
  CreateTaskFormData,
  CreateTaskFormSchema
} from '../../../schemas/taskSchema'
import { useGetMembersQuery } from '../../../store/api/usersApi'
import { Badge } from '../../atoms/Badge/Badge'
import { Button } from '../../atoms/Button/Button'
import { Input } from '../../atoms/Input/Input'
import { Label } from '../../atoms/Label/Label'
import { Select } from '../../atoms/Select/Select'
import { SelectOption } from '../../atoms/Select/Select.types'
import { Text } from '../../atoms/Text/Text'
import * as multiSelectStyles from './LabelMultiSelect.css'
import * as styles from './TaskForm.css'
import { TaskFormProps } from './TaskForm.types'

// 仮のラベル候補 (将来的には API から取得 or 設定ファイル)
const AVAILABLE_LABELS = [
  '家事',
  '仕事',
  '買い物',
  '重要',
  '個人',
  '後でやる',
  '不明'
]

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialValues,
  isEditing = false
}) => {
  const {
    data: members,
    isLoading: isLoadingMembers,
    isError: isErrorMembers
  } = useGetMembersQuery()

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(CreateTaskFormSchema), // ★ Zod スキーマでバリデーション
    defaultValues: { name: '', assigneeId: '', dueDate: '', labels: [] }
  })

  // ★ initialValues が変更されたらフォームをリセットする
  useEffect(() => {
    if (initialValues) {
      // assigneeId や dueDate が null の場合に備えて空文字に変換
      const defaultVals: CreateTaskFormData = {
        name: initialValues.name ?? '',
        assigneeId: initialValues.assigneeId ?? '',
        dueDate: initialValues.dueDate ?? '',
        labels: Array.isArray(initialValues.labels) ? initialValues.labels : []
        // isCompleted は CreateTaskFormSchema にないので注意 (必要ならスキーマに追加)
      }
      reset(defaultVals)
    } else {
      // 新規作成モードの場合はフォームを空にする
      reset({ name: '', assigneeId: '', dueDate: '', labels: [] })
    }
  }, [initialValues, reset]) // initialValues と reset を依存配列に

  const handleValidSubmit: SubmitHandler<CreateTaskFormData> = async (data) => {
    await onSubmit(data)
  }

  const submitting = isLoading || isSubmitting || isLoadingMembers

  const memberOptions: SelectOption[] = React.useMemo(() => {
    if (!members) return []
    return members.map((member) => ({
      value: member.id, // value には ID を設定
      label: member.name // label には名前を設定
    }))
  }, [members]) // members が変化した場合のみ再計算

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
        <Label htmlFor="assigneeId">担当者</Label>
        <Controller
          name="assigneeId" // フィールド名はそのまま
          control={control}
          // デフォルト値は useForm で設定済みだが、Controller でも設定可能
          // defaultValue="" // 未選択状態の値
          render={({ field, fieldState }) => (
            <Select
              id="assigneeId"
              {...field}
              value={field.value ?? ''} // null/undefined なら空文字に
              options={memberOptions} // ★ API から取得したデータで選択肢を生成
              placeholder="担当者を選択" // ★ placeholder を設定
              isError={!!fieldState.error || isErrorMembers} // ★ APIエラーも考慮
              disabled={submitting || isLoadingMembers} // ★ メンバー読み込み中も無効化
              aria-describedby={
                fieldState.error ? 'assigneeId-error' : undefined
              }
            />
          )}
        />
        {/* メンバーリスト取得エラーの場合の表示 (任意) */}
        {isErrorMembers && (
          <Text fontSize="sm" color="error" className={styles.errorMessage}>
            担当者リストの読み込みに失敗しました。
          </Text>
        )}
        {/* バリデーションエラー表示 */}
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

      <div className={styles.formField}>
        <Label htmlFor="taskLabelsTrigger" required>
          ラベル
        </Label>
        <Controller
          name="labels" // フィールド名は 'labels'
          control={control}
          render={({ field, fieldState }) => {
            // field.value は string[]
            const selectedLabels = field.value ?? [] // null/undefined チェック
            return (
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    id="taskLabelsTrigger"
                    className={multiSelectStyles.triggerButton} // スタイル適用
                    disabled={submitting}
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? 'taskLabels-error' : undefined
                    }
                  >
                    <span className={multiSelectStyles.triggerValue}>
                      {/* ★ field.value (配列) を直接 map して Badge を表示 */}
                      {selectedLabels.length > 0 ? (
                        selectedLabels.map((label) => (
                          <Badge
                            key={label}
                            className={multiSelectStyles.triggerBadge}
                          >
                            {label}
                          </Badge>
                        ))
                      ) : (
                        <span className={multiSelectStyles.placeholder}>
                          ラベルを選択...
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={16}
                      className={multiSelectStyles.triggerIcon}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverPortal>
                  <PopoverContent
                    className={multiSelectStyles.popoverContent} // スタイル適用
                    sideOffset={5}
                    align="start"
                  >
                    {AVAILABLE_LABELS.map((labelOption) => (
                      <div
                        key={labelOption}
                        className={multiSelectStyles.checkboxItem}
                      >
                        <CheckboxPrimitive.Root
                          id={`label-${labelOption}`}
                          // ★ field.value (配列) に含まれるかで checked を判断
                          checked={selectedLabels.includes(labelOption)}
                          onCheckedChange={(checked) => {
                            const currentValues = selectedLabels // 現在の配列
                            let newValues: string[]
                            if (checked === true) {
                              newValues = [...currentValues, labelOption]
                            } else {
                              newValues = currentValues.filter(
                                (v) => v !== labelOption
                              )
                            }
                            // ★ 更新された配列をそのまま onChange に渡す
                            field.onChange(newValues)
                          }}
                          className={multiSelectStyles.checkboxRoot} // スタイル適用
                        >
                          <CheckboxPrimitive.Indicator
                            className={multiSelectStyles.checkboxIndicator}
                          >
                            <Check size={12} strokeWidth={3} />
                          </CheckboxPrimitive.Indicator>
                        </CheckboxPrimitive.Root>
                        <Label
                          htmlFor={`label-${labelOption}`}
                          className={multiSelectStyles.checkboxLabel}
                        >
                          {labelOption}
                        </Label>
                      </div>
                    ))}
                  </PopoverContent>
                </PopoverPortal>
              </PopoverRoot>
            )
          }}
        />
        {errors.labels && (
          <Text
            id="taskLabels-error"
            fontSize="sm"
            color="error"
            className={styles.errorMessage}
            role="alert"
          >
            {/* 配列のエラーメッセージ表示 */}
            {errors.labels.message}
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
          {/* ★ isEditing フラグに応じてボタンテキストを変更 */}
          {isEditing ? '更新' : '作成'}
        </Button>
      </div>
    </form>
  )
}
