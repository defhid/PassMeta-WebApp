/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AppInfoDto */
export interface AppInfoDto {
    /** Appid */
    appId: string;
    /** Appversion */
    appVersion: string;
    user: UserDto | null;
}

/** Body_ctrl_passfiles__passfile_id__versions_new_post */
export interface BodyCtrlPassfilesPassfileIdVersionsNewPost {
    /**
     * Smth
     * @format binary
     */
    smth: File;
}

/** FullResultDto */
export interface FullResultDto {
    /** Code */
    code: number;
    /** Msg */
    msg: string;
    /** More */
    more: string[] | null;
}

/** HistoryDto */
export interface HistoryDto {
    /** Id */
    id: number;
    /** Kind */
    kind: string;
    /** Userip */
    userIp: string;
    /** Userid */
    userId: number;
    /** Userlogin */
    userLogin: string | null;
    /** Affecteduserid */
    affectedUserId: number | null;
    /** Affecteduserlogin */
    affectedUserLogin: string | null;
    /** Affectedpassfileid */
    affectedPassfileId: number | null;
    /** Affectedpassfilename */
    affectedPassfileName: string | null;
    /** More */
    more: string | null;
    /**
     * Writtenon
     * @format date-time
     */
    writtenOn: Date;
}

/** HistoryKindDto */
export interface HistoryKindDto {
    /** Id */
    id: number;
    /** Name */
    name: string;
}

/** HistoryKindListDto */
export interface HistoryKindListDto {
    /** List */
    list: HistoryKindDto[];
}

/** HistoryPageDto */
export interface HistoryPageDto {
    /** List */
    list: HistoryDto[];
    /** Total */
    total: number;
    /** Pagesize */
    pageSize: number;
    /** Pageindex */
    pageIndex: number;
}

/** PassfileDto */
export interface PassfileDto {
    /** Id */
    id: number;
    /** Name */
    name: string;
    /** Color */
    color: string | null;
    /** Typeid */
    typeId: number;
    /** Userid */
    userId: number;
    /** Version */
    version: number;
    /**
     * Createdon
     * @format date-time
     */
    createdOn: Date;
    /**
     * Infochangedon
     * @format date-time
     */
    infoChangedOn: Date;
    /**
     * Versionchangedon
     * @format date-time
     */
    versionChangedOn: Date;
}

/** PassfileListDto */
export interface PassfileListDto {
    /** List */
    list: PassfileDto[];
}

/** PassfilePatchDto */
export interface PassfilePatchDto {
    /** Name */
    name: string;
    /** Color */
    color: string | null;
}

/** PassfilePostDto */
export interface PassfilePostDto {
    /** Name */
    name: string;
    /** Color */
    color: string | null;
    /**
     * Typeid
     * @min 1
     * @max 32767
     */
    typeId: number;
    /**
     * Createdon
     * @format date-time
     */
    createdOn: Date;
}

/** PassfileVersionDto */
export interface PassfileVersionDto {
    /** Passfileid */
    passfileId: number;
    /** Version */
    version: number;
    /**
     * Versiondate
     * @format date-time
     */
    versionDate: Date;
}

/** PassfileVersionListDto */
export interface PassfileVersionListDto {
    /** List */
    list: PassfileVersionDto[];
}

/** SignInDto */
export interface SignInDto {
    /** Login */
    login: string;
    /** Password */
    password: string;
}

/** SignUpDto */
export interface SignUpDto {
    /** Login */
    login: string;
    /** Password */
    password: string;
    /** Fullname */
    fullName: string;
}

/** UserDto */
export interface UserDto {
    /** Id */
    id: number;
    /** Login */
    login: string;
    /** Fullname */
    fullName: string;
    /** Isactive */
    isActive: boolean;
}

/** UserPatchDto */
export interface UserPatchDto {
    /** Fullname */
    fullName: string | null;
    /** Login */
    login: string | null;
    /** Password */
    password: string | null;
    /** Passwordconfirm */
    passwordConfirm: string | null;
}

export interface CtrlHistoryPagesPageIndexGetParams {
    /**
     * Pagesize
     * @min 0
     * @max 100
     */
    pageSize: number;
    /**
     * Month
     * @format date
     */
    month: string;
    /** Kind */
    kind?: string | null;
    /**
     * Pageindex
     * @min 0
     */
    pageIndex: number;
}

export interface CtrlPassfilesGetParams {
    /** Typeid */
    typeId: number | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat;
    /** request body */
    body?: unknown;
    /** base url */
    baseUrl?: string;
    /** request cancellation token */
    cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
    securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
    customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
    data: D;
    error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = "/api";
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private abortControllers = new Map<CancelToken, AbortController>();
    private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

    private baseApiParams: RequestParams = {
        credentials: "same-origin",
        headers: {},
        redirect: "follow",
        referrerPolicy: "no-referrer",
    };

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig);
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key]);
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key];
        return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
        return keys
            .map((key) =>
                Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key),
            )
            .join("&");
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : "";
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
        [ContentType.Text]: (input: any) =>
            input !== null && typeof input !== "string" ? JSON.stringify(input) : input,
        [ContentType.FormData]: (input: any) =>
            Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key];
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === "object" && property !== null
                          ? JSON.stringify(property)
                          : `${property}`,
                );
                return formData;
            }, new FormData()),
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
    };

    protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                return abortController.signal;
            }
            return void 0;
        }

        const abortController = new AbortController();
        this.abortControllers.set(cancelToken, abortController);
        return abortController.signal;
    };

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken);

        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(cancelToken);
        }
    };

    public request = async <T = any, E = any>({
        body,
        secure,
        path,
        type,
        query,
        format,
        baseUrl,
        cancelToken,
        ...params
    }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const queryString = query && this.toQueryString(query);
        const payloadFormatter = this.contentFormatters[type || ContentType.Json];
        const responseFormat = format || requestParams.format;

        return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
            },
            signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
            body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
        }).then(async (response) => {
            const r = response.clone() as HttpResponse<T, E>;
            r.data = null as unknown as T;
            r.error = null as unknown as E;

            const data = !responseFormat
                ? r
                : await response[responseFormat]()
                      .then((data) => {
                          if (r.ok) {
                              r.data = data;
                          } else {
                              r.error = data;
                          }
                          return r;
                      })
                      .catch((e) => {
                          r.error = e;
                          return r;
                      });

            if (cancelToken) {
                this.abortControllers.delete(cancelToken);
            }

            if (!response.ok) throw data;
            return data;
        });
    };
}

/**
 * @title FastAPI
 * @version 0.1.0
 * @baseUrl /api
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    auth = {
        /**
         * No description
         *
         * @name CtrlAuthSignInPost
         * @summary Ctrl
         * @request POST:/auth/sign-in
         */
        ctrlAuthSignInPost: (data: SignInDto, params: RequestParams = {}) =>
            this.request<UserDto, FullResultDto>({
                path: `/auth/sign-in`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlAuthResetMePost
         * @summary Ctrl
         * @request POST:/auth/reset/me
         */
        ctrlAuthResetMePost: (params: RequestParams = {}) =>
            this.request<any, FullResultDto>({
                path: `/auth/reset/me`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlAuthResetAllPost
         * @summary Ctrl
         * @request POST:/auth/reset/all
         */
        ctrlAuthResetAllPost: (params: RequestParams = {}) =>
            this.request<any, FullResultDto>({
                path: `/auth/reset/all`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlAuthResetAllExceptMePost
         * @summary Ctrl
         * @request POST:/auth/reset/all-except-me
         */
        ctrlAuthResetAllExceptMePost: (params: RequestParams = {}) =>
            this.request<any, FullResultDto>({
                path: `/auth/reset/all-except-me`,
                method: "POST",
                format: "json",
                ...params,
            }),
    };
    info = {
        /**
         * No description
         *
         * @name CtrlInfoGet
         * @summary Ctrl
         * @request GET:/info
         */
        ctrlInfoGet: (params: RequestParams = {}) =>
            this.request<AppInfoDto, FullResultDto>({
                path: `/info`,
                method: "GET",
                format: "json",
                ...params,
            }),
    };
    check = {
        /**
         * No description
         *
         * @name CtrlCheckGet
         * @summary Ctrl
         * @request GET:/check
         */
        ctrlCheckGet: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/check`,
                method: "GET",
                format: "json",
                ...params,
            }),
    };
    history = {
        /**
         * No description
         *
         * @name CtrlHistoryKindsGet
         * @summary Ctrl
         * @request GET:/history/kinds
         */
        ctrlHistoryKindsGet: (params: RequestParams = {}) =>
            this.request<HistoryKindListDto, FullResultDto>({
                path: `/history/kinds`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlHistoryPagesPageIndexGet
         * @summary Ctrl
         * @request GET:/history/pages/{pageIndex}
         */
        ctrlHistoryPagesPageIndexGet: (
            { pageIndex, ...query }: CtrlHistoryPagesPageIndexGetParams,
            params: RequestParams = {},
        ) =>
            this.request<HistoryPageDto, FullResultDto>({
                path: `/history/pages/${pageIndex}`,
                method: "GET",
                query: query,
                format: "json",
                ...params,
            }),
    };
    passfiles = {
        /**
         * No description
         *
         * @name CtrlPassfilesGet
         * @summary Ctrl
         * @request GET:/passfiles
         */
        ctrlPassfilesGet: (query: CtrlPassfilesGetParams, params: RequestParams = {}) =>
            this.request<PassfileListDto, FullResultDto>({
                path: `/passfiles`,
                method: "GET",
                query: query,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlPassfilesPassfileIdGet
         * @summary Ctrl
         * @request GET:/passfiles/{passfile_id}
         */
        ctrlPassfilesPassfileIdGet: (passfileId: number, params: RequestParams = {}) =>
            this.request<PassfileDto, FullResultDto>({
                path: `/passfiles/${passfileId}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlPassfilesPassfileIdPatch
         * @summary Ctrl
         * @request PATCH:/passfiles/{passfile_id}
         */
        ctrlPassfilesPassfileIdPatch: (passfileId: number, data: PassfilePatchDto, params: RequestParams = {}) =>
            this.request<PassfileDto, FullResultDto>({
                path: `/passfiles/${passfileId}`,
                method: "PATCH",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlPassfilesPassfileIdDelete
         * @summary Ctrl
         * @request DELETE:/passfiles/{passfile_id}
         */
        ctrlPassfilesPassfileIdDelete: (passfileId: number, params: RequestParams = {}) =>
            this.request<any, FullResultDto>({
                path: `/passfiles/${passfileId}`,
                method: "DELETE",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlPassfilesPassfileIdVersionsGet
         * @summary Ctrl
         * @request GET:/passfiles/{passfile_id}/versions
         */
        ctrlPassfilesPassfileIdVersionsGet: (passfileId: number, params: RequestParams = {}) =>
            this.request<PassfileVersionListDto, FullResultDto>({
                path: `/passfiles/${passfileId}/versions`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlPassfilesPassfileIdVersionsVersionGet
         * @summary Ctrl
         * @request GET:/passfiles/{passfile_id}/versions/{version}
         */
        ctrlPassfilesPassfileIdVersionsVersionGet: (passfileId: number, version: number, params: RequestParams = {}) =>
            this.request<File, FullResultDto>({
                path: `/passfiles/${passfileId}/versions/${version}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlPassfilesNewPost
         * @summary Ctrl
         * @request POST:/passfiles/new
         */
        ctrlPassfilesNewPost: (data: PassfilePostDto, params: RequestParams = {}) =>
            this.request<PassfileDto, FullResultDto>({
                path: `/passfiles/new`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlPassfilesPassfileIdVersionsNewPost
         * @summary Ctrl
         * @request POST:/passfiles/{passfile_id}/versions/new
         */
        ctrlPassfilesPassfileIdVersionsNewPost: (
            passfileId: number,
            data: BodyCtrlPassfilesPassfileIdVersionsNewPost,
            params: RequestParams = {},
        ) =>
            this.request<PassfileDto, FullResultDto>({
                path: `/passfiles/${passfileId}/versions/new`,
                method: "POST",
                body: data,
                type: ContentType.FormData,
                format: "json",
                ...params,
            }),
    };
    users = {
        /**
         * No description
         *
         * @name CtrlUsersNewPost
         * @summary Ctrl
         * @request POST:/users/new
         */
        ctrlUsersNewPost: (data: SignUpDto, params: RequestParams = {}) =>
            this.request<UserDto, FullResultDto>({
                path: `/users/new`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlUsersMeGet
         * @summary Ctrl
         * @request GET:/users/me
         */
        ctrlUsersMeGet: (params: RequestParams = {}) =>
            this.request<UserDto, FullResultDto>({
                path: `/users/me`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @name CtrlUsersMePatch
         * @summary Ctrl
         * @request PATCH:/users/me
         */
        ctrlUsersMePatch: (data: UserPatchDto, params: RequestParams = {}) =>
            this.request<UserDto, FullResultDto>({
                path: `/users/me`,
                method: "PATCH",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    };
}
