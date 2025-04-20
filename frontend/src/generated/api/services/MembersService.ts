/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessResponse } from '../models/SuccessResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MembersService {
    /**
     * 家族メンバー一覧取得
     * 現在認証されているユーザーが所属する家族（または共有グループ）のメンバー一覧を取得します。担当者選択などで使用します。
     * @returns any メンバー一覧取得成功
     * @throws ApiError
     */
    public static getMembers(): CancelablePromise<(SuccessResponse & {
        data: Array<User>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/members',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
