/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskInput } from '../models/CreateTaskInput';
import type { PutTaskInput } from '../models/PutTaskInput';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { Task } from '../models/Task';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TasksService {
    /**
     * タスク一覧取得
     * @returns any タスク一覧取得成功
     * @throws ApiError
     */
    public static getTasks({
        isCompleted,
    }: {
        /**
         * 完了状態でフィルタリング (true/false)
         */
        isCompleted?: boolean,
    }): CancelablePromise<(SuccessResponse & {
        data: Array<Task>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks',
            query: {
                'isCompleted': isCompleted,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * 新規タスク作成
     * @returns any タスク作成成功
     * @throws ApiError
     */
    public static postTasks({
        requestBody,
    }: {
        requestBody: CreateTaskInput,
    }): CancelablePromise<(SuccessResponse & {
        data: Task;
    })> {
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
     * @returns any タスク更新成功
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
    }): CancelablePromise<(SuccessResponse & {
        data: Task;
    })> {
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
