import type { ApiProtocol, ApiResponse } from "./apiProtocol";
import type { Deserializer } from "../serialization";
import { useAppConfig } from "@utils/appConfig";

type RestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RestFailureResponse = { message: string, more: string[] | null };

export class RestProtocolFactory {
    static void<
        TParams extends Record<string, any> | undefined,
        TMethod extends RestMethod,
    >(
        method: TMethod,
        url: (params: TParams) => string,
        options?: {
            query?: (params: TParams) => Record<string, any>,
            body?: TMethod extends "GET"
                ? never
                : (params: TParams) => Record<string, any>,
        },
    ): ApiProtocol<TParams> {
        return this.build(async (params) => {
            const [query, body] = this.getFetchOptions(params!, options);

            const uri = useAppConfig().PASSMETA_API + "/" + url(params!) + query;

            const response = await fetch(uri, { method, body });
            if (response.ok) {
                return {
                    ok: true,
                    message: undefined,
                    more: undefined,
                    data: undefined,
                };
            }

            const json = await this.decodeJson(response) as RestFailureResponse | null;
            return {
                ok: false,
                message: json?.message ?? "Unknown error",
                more: json?.more ?? [],
                data: undefined,
            };
        });
    }

    static json<
        TParams extends Record<string, any> | undefined,
        TResponse,
        TMethod extends RestMethod,
    >(
        method: TMethod,
        url: (params: TParams) => string,
        options?: {
            query?: (params: TParams) => Record<string, any>,
            body?: TMethod extends "GET"
                ? never
                : (params: TParams) => Record<string, any>,
            deserialize?: Deserializer<TResponse>,
        },
    ): ApiProtocol<TParams, TResponse> {
        return this.build(async (params) => {
            const [query, body] = this.getFetchOptions(params!, options);

            const uri = useAppConfig().PASSMETA_API + "/" + url(params!) + query;

            const response = await fetch(uri, { method, body });
            let json = await this.decodeJson(response);

            if (response.ok) {
                if (options?.deserialize) {
                    json = options.deserialize(json);
                }

                return {
                    ok: true,
                    message: undefined,
                    more: undefined,
                    data: json as TResponse,
                };
            }

            return {
                ok: false,
                message: (json as RestFailureResponse)?.message as string ?? "Unknown error",
                more: (json as RestFailureResponse)?.more as string[] ?? [],
                data: undefined,
            };
        });
    }

    static blob<
        TParams extends Record<string, any> | undefined,
        TMethod extends RestMethod,
    >(
        method: TMethod,
        url: (params: TParams) => string,
        options?: {
            query?: (params: TParams) => Record<string, any>,
            body?: TMethod extends "GET"
                ? never
                : (params: TParams) => Record<string, any>,
        },
    ): ApiProtocol<TParams, Blob> {
        return this.build(async (params) => {
            const [query, body] = this.getFetchOptions(params!, options);

            const uri = useAppConfig().PASSMETA_API + "/" + url(params!) + query;

            const response = await fetch(uri, { method, body });
            if (response.ok) {
                const blob = await this.decodeBlob(response);
                return {
                    ok: true,
                    message: undefined,
                    more: undefined,
                    data: blob!,
                };
            }

            const json = await this.decodeJson(response) as RestFailureResponse | null;
            return {
                ok: false,
                message: json?.message as string ?? "Unknown error",
                more: json?.more as string[] ?? [],
                data: undefined,
            };
        });
    }

    private static build<
        TParams extends Record<string, undefined> | undefined,
        TResponse,
    >(
        executor: (params?: TParams) => Promise<ApiResponse<TResponse>>,
    ): ApiProtocol<TParams, TResponse> {
        return {
            execute: (async (params?: TParams): Promise<TResponse> => {
                const result = await executor(params);

                if (!result.ok) {
                    alert(result.message + "\n" + result.more.join("\n")); // TODO
                    throw new Error(result.message);
                }

                return result.data;
            }) as ApiProtocol<TParams, TResponse>["execute"],

            executeSilent: (async (params?: TParams): Promise<ApiResponse<TResponse>> => {
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
            }) as ApiProtocol<TParams, TResponse>["executeSilent"],
        };
    }

    private static async decodeJson(response: Response): Promise<unknown> {
        try {
            return await response.json();
        } catch (err) {
            console.error("Failed to decode json response", err);
            return null;
        }
    }

    private static async decodeBlob(response: Response): Promise<Blob | null> {
        try {
            return await response.blob();
        } catch (err) {
            console.error("Failed to decode blob response", err);
            return null;
        }
    }

    private static getFetchOptions<TParams>(
        params: TParams,
        options: {
            query?: (params: TParams) => Record<string, any>,
            body?: (params: TParams) => Record<string, any>,
        } | undefined,
    ): [
        query: string,
        body: string | undefined,
    ] {
        try {
            const query = options?.query ? "?" + new URLSearchParams(options.query(params)) : "";
            const body = options?.body ? JSON.stringify(options.body(params)) : undefined;
            return [query, body];
        } catch (err) {
            const customErr = new Error("Failed to build request");
            console.error(customErr.message, err);
            throw customErr;
        }
    }
}
