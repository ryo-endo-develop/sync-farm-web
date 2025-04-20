import { z } from 'zod'

// OpenAPI の User スキーマに対応する Zod スキーマ
export const UserSchema = z.object({
  id: z.string().uuid(), // UUID形式の文字列
  name: z.string(), // 文字列
  // email: z.string().email().optional(), // OpenAPI に email があれば追加
  // avatarUrl: z.string().url().nullable().optional(), // OpenAPI に avatarUrl があれば追加
  createdAt: z.string().datetime(), // ISO 8601 形式の日時文字列
  updatedAt: z.string().datetime() // ISO 8601 形式の日時文字列
})

// UserSchema から TypeScript の型を生成
export type User = z.infer<typeof UserSchema>

// ユーザー一覧 (APIレスポンスの data 部分) のスキーマ
export const UserListSchema = z.array(UserSchema)
