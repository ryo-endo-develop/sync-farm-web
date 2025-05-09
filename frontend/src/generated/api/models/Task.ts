/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Label } from './Label';
export type Task = {
    /**
     * タスクの一意なID (サーバーで自動採番)
     */
    readonly id: string;
    /**
     * タスク名
     */
    name: string;
    /**
     * 担当者のユーザーID (nullの場合は未割り当て)
     */
    assigneeId?: string | null;
    /**
     * 期限日 (YYYY-MM-DD)
     */
    dueDate?: string | null;
    /**
     * 完了状態フラグ
     */
    isCompleted: boolean;
    /**
     * タスクに付与されたラベルのリスト
     */
    labels: Array<Label>;
    /**
     * このタスクが定常タスクかどうか
     */
    isRecurring?: boolean;
    /**
     * 繰り返しのルール
     */
    recurrenceRule?: string | null;
    /**
     * 作成日時
     */
    readonly createdAt: string;
    /**
     * 更新日時
     */
    readonly updatedAt: string;
};

