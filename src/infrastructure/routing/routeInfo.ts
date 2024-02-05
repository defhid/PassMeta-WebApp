import type { RouteLocationRaw } from "vue-router";

export interface RouteInfo<
    TRouteParams extends Record<string, any> | undefined,
    TQueryParams extends Record<string, any> | undefined
> {
    readonly to: (TRouteParams extends Partial<TRouteParams>
        ? TQueryParams extends Partial<TQueryParams>
            ? (options?: { queryParams?: TQueryParams, routeParams?: TRouteParams })
                => RouteLocationRaw
            : (options: { queryParams: TQueryParams, routeParams?: TRouteParams })
                => RouteLocationRaw
        : TQueryParams extends Partial<TQueryParams>
            ? (options: { routeParams: TRouteParams, queryParams?: TQueryParams })
                => RouteLocationRaw
            : (options: { routeParams: TRouteParams, queryParams: TQueryParams })
                => RouteLocationRaw) & {
        name: string,
        path: string,
        isInner: boolean,
        isAnonymous: boolean,
    };
}
