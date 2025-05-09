/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskInput } from '../models/CreateTaskInput';
import type { PaginatedTasksResponse } from '../models/PaginatedTasksResponse';
import type { PutTaskInput } from '../models/PutTaskInput';
import type { Task } from '../models/Task';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TasksService {
    /**
     * タスク一覧取得
     * @returns PaginatedTasksResponse タスク一覧取得成功
     * @throws ApiError
     */
    public static getTasks({
        assigneeId,
        isCompleted,
        sort = 'createdAt_desc',
        labels,
        page = 1,
        limit = 20,
    }: {
        /**
         * 担当者IDでフィルタリング ('me' で自分のタスクを指定可能)
         */
        assigneeId?: string,
        /**
         * 完了状態でフィルタリング (true/false)
         */
        isCompleted?: boolean,
        /**
         * ソート順を指定
         */
        sort?: 'createdAt_desc' | 'createdAt_asc' | 'dueDate_asc' | 'dueDate_desc',
        /**
         * 指定されたラベルを**すべて**含むタスクをフィルタリング (カンマ区切り)
         */
        labels?: string,
        /**
         * 表示するページ番号 (1始まり)
         */
        page?: number,
        /**
         * 1ページあたりのアイテム数
         */
        limit?: number,
    }): CancelablePromise<PaginatedTasksResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks',
            query: {
                'assigneeId': assigneeId,
                'isCompleted': isCompleted,
                'sort': sort,
                'labels': labels,
                'page': page,
                'limit': limit,
            },
            errors: {
                400: `Bad Request (Invalid query parameters)`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * 新規タスク作成
     * @returns Task タスク作成成功
     * @throws ApiError
     */
    public static postTasks({
        requestBody,
    }: {
        requestBody: CreateTaskInput,
    }): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request (バリデーションエラーなど)`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * タスク更新 (全量)
     * @returns Task タスク更新成功
     * @throws ApiError
     */
    public static putTasks({
        taskId,
        requestBody,
    }: {
        /**
         * 操作対象のタスクID
         */
        taskId: string,
        requestBody: PutTaskInput,
    }): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tasks/{taskId}',
            path: {
                'taskId': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request (バリデーションエラーなど)`,
                404: `Task Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * タスク削除
     * @returns void
     * @throws ApiError
     */
    public static deleteTasks({
        taskId,
    }: {
        /**
         * 操作対象のタスクID
         */
        taskId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tasks/{taskId}',
            path: {
                'taskId': taskId,
            },
            errors: {
                404: `Task Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
