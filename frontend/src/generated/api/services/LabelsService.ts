/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Label } from '../models/Label';
import type { LabelCreateInput } from '../models/LabelCreateInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LabelsService {
    /**
     * ラベル一覧取得
     * 利用可能なすべてのラベルを取得します。
     * @returns any ラベル一覧取得成功
     * @throws ApiError
     */
    public static getLabels(): CancelablePromise<{
        data: Array<Label>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * 新規ラベル作成
     * 新しいラベルを作成します。
     * @returns Label ラベル作成成功
     * @throws ApiError
     */
    public static postLabels({
        requestBody,
    }: {
        requestBody: LabelCreateInput,
    }): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/labels',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
