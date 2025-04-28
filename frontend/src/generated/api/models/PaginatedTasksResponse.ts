/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginationMeta } from './PaginationMeta';
import type { Task } from './Task';
export type PaginatedTasksResponse = {
    /**
     * 現在のページのタスクデータ
     */
    data: Array<Task>;
    meta: PaginationMeta;
};

