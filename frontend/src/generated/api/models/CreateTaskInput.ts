/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTaskInput = {
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
     * 紐付けるラベルのID配列 (必須、最低1つ)
     */
    label_ids: Array<string>;
};

