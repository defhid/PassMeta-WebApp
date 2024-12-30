export interface ApiProtocol<TParams extends Record<string, any> | undefined = undefined, TResponse = undefined> {
    (): TParams extends undefined ? Promise<TResponse> : never;

    (params: TParams): Promise<TResponse>;

    silent: TParams extends undefined
        ? () => Promise<ApiResponse<TResponse>>
        : (params: TParams) => Promise<ApiResponse<TResponse>>;
}

export type ApiResponse<TPayload = undefined> =
    | {
          ok: true;
          message: undefined;
          more: undefined;
          data: TPayload;
      }
    | {
          ok: false;
          message: string;
          more: string[];
          data: undefined;
      };
