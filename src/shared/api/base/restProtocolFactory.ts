import type { ApiProtocol, ApiResponse, Deserializer } from "~infra";
import { t, useAppConfig, useAppSettings } from "~stores";
import { Api, type FullResultDto, type HttpResponse } from "~generated/api";

export class RestProtocolFactory {
    static onError: ((message: string, more?: string[]) => void) | null = null;

    static fromGenerated<TParams extends Record<string, any> | undefined = undefined, TResponse = undefined>(
        call: (api: Api<unknown>, params: TParams) => Promise<HttpResponse<TResponse, FullResultDto>>,
        options?: {
            deserialize?: TResponse extends undefined ? undefined : Deserializer<TResponse>;
        },
    ): ApiProtocol<TParams, TResponse> {
        return this.build(async (params) => {
            try {
                const api = new Api({
                    baseUrl: useAppConfig().passmetaApi,
                    customFetch: (input, init) => fetch(input as string, { ...init, credentials: "include" }),
                });

                const request = api.request;
                api.request = (args) =>
                    request({
                        ...args,
                        query: { ...args?.query, lang: useAppSettings().locale },
                    });

                const response = await call(api, params!);
                return {
                    ok: true,
                    message: undefined,
                    more: undefined,
                    data: options?.deserialize ? options.deserialize(response.data) : response.data,
                };
            } catch (err) {
                if (err instanceof Error) {
                    throw err;
                }

                return {
                    ok: false,
                    message:
                        ((err as HttpResponse<TResponse, FullResultDto>).error?.msg as string) ??
                        t("Common.Api.UnknownError"),
                    more: ((err as HttpResponse<TResponse, FullResultDto>).error?.more as string[]) ?? [],
                    data: undefined,
                };
            }
        });
    }

    private static build<TParams extends Record<string, undefined> | undefined, TResponse>(
        executor: (params?: TParams) => Promise<ApiResponse<TResponse>>,
    ): ApiProtocol<TParams, TResponse> {
        const execute: Omit<ApiProtocol<TParams, TResponse>, "silent"> = async (
            params?: TParams,
        ): Promise<TResponse> => {
            let result: ApiResponse<TResponse> | null = null;

            try {
                result = await executor(params);
            } catch (err) {
                this.onError?.(t("Common.Api.UnknownError"));
                throw err;
            }

            if (!result.ok) {
                this.onError?.(result.message, result.more);
                throw new Error(result.message);
            }

            return result.data;
        };

        (execute as ApiProtocol<TParams, TResponse>).silent = (async (
            params?: TParams,
        ): Promise<ApiResponse<TResponse>> => {
            try {
                return await executor(params);
            } catch (err) {
                return {
                    ok: false,
                    message: (err as Error).message,
                    more: [],
                    data: undefined,
                };
            }
        }) as ApiProtocol<TParams, TResponse>["silent"];

        return execute as ApiProtocol<TParams, TResponse>;
    }
}
