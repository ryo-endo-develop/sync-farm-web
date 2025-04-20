// src/schemas/taskSchema.ts (新規作成)
import { z } from 'zod'

// APIレスポンスの Task オブジェクトに対応するスキーマ
export const TaskSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  assigneeId: z.string().uuid().nullable(),
  // dueDate は YYYY-MM-DD 形式の文字列か null
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: '日付はYYYY-MM-DD形式で入力してください。'
    })
    .nullable(),
  isCompleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})
export type Task = z.infer<typeof TaskSchema>

// タスク作成フォームの入力値に対応するスキーマ
export const CreateTaskFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'タスク名は必須です。' }) // 必須チェック + メッセージ
    .max(100, { message: 'タスク名は100文字以内で入力してください。' }), // 最大長チェック
  // assigneeId は UUID 形式 or 空文字 or null/undefined を許容
  assigneeId: z
    .string()
    .uuid({ message: '有効な担当者ID (UUID) を入力してください。' })
    .nullable() // null を許容
    .optional() // undefined を許容 (フォームで未入力の場合など)
    .or(z.literal('')), // 空文字列も許容 (input が空の場合)
  // dueDate は YYYY-MM-DD 形式 or 空文字 or null/undefined を許容
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: '日付はYYYY-MM-DD形式で入力してください。'
    })
    .nullable()
    .optional()
    .or(z.literal(''))
  // .transform(val => val === '' ? null : val), // 送信前に空文字列を null に変換する場合
})

// CreateTaskFormSchema から TypeScript の型を生成 (これが TaskForm で使う型)
export type CreateTaskFormData = z.infer<typeof CreateTaskFormSchema>

// --- 以下は PUT (更新) 用のスキーマ (参考) ---

// タスク更新フォームの入力値に対応するスキーマ (PUT用)
export const PutTaskFormSchema = z.object({
  name: z.string().min(1, { message: 'タスク名は必須です。' }).max(100),
  assigneeId: z
    .string()
    .uuid({ message: '有効な担当者ID (UUID) を入力してください。' })
    .nullable()
    .optional()
    .or(z.literal('')),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: '日付はYYYY-MM-DD形式で入力してください。'
    })
    .nullable()
    .optional()
    .or(z.literal('')),
  isCompleted: z.boolean() // PUT では完了状態も必須
})
export type PutTaskFormData = z.infer<typeof PutTaskFormSchema>

// --- 以下は API リクエストボディ用のスキーマ (参考) ---
// フォームデータから変換する場合に使う

// API の PUT リクエストボディ用スキーマ
export const PutTaskInputSchema = PutTaskFormSchema.transform((data) => ({
  ...data,
  assigneeId: data.assigneeId === '' ? null : data.assigneeId, // 空文字列を null に
  dueDate: data.dueDate === '' ? null : data.dueDate // 空文字列を null に
}))
export type PutTaskInput = z.infer<typeof PutTaskInputSchema>

// API の POST リクエストボディ用スキーマ
export const CreateTaskInputSchema = CreateTaskFormSchema.transform((data) => ({
  name: data.name, // name は必須
  assigneeId: data.assigneeId === '' ? null : data.assigneeId, // 空文字列を null に
  dueDate: data.dueDate === '' ? null : data.dueDate // 空文字列を null に
}))
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>
