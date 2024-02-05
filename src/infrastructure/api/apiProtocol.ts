export interface ApiProtocol<
    TParams extends Record<string, any> | undefined = undefined,
    TResponse = undefined
> {
    execute: TParams extends undefined
        ? () => Promise<TResponse>
        : (params: TParams) => Promise<TResponse>;

    executeSilent: TParams extends undefined
        ? () => Promise<ApiResponse<TResponse>>
        : (params: TParams) => Promise<ApiResponse<TResponse>>;
}


export type ApiResponse<TPayload = undefined> = {
    ok: true,
    message: undefined,
    more: undefined,
    data: TPayload,
} | {
    ok: false,
    message: string,
    more: string[],
    data: undefined,
};
