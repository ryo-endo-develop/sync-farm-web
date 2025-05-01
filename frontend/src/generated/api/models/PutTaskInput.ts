/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 更新後のタスクの完全な状態 (id, createdAt, updatedAtを除く)
 */
export type PutTaskInput = {
    /**
     * タスク名 (必須)
     */
    name: string;
    /**
     * 担当者のユーザーID (null許容)
     */
    assigneeId?: string | null;
    /**
     * 期限日 (YYYY-MM-DD, null許容)
     */
    dueDate?: string | null;
    /**
     * 完了状態フラグ (必須)
     */
    isCompleted: boolean;
    /**
     * 更新後のラベルID配列 (これで既存の紐付けは上書きされる。必須、最低1つ)
     */
    label_ids: Array<string>;
};

