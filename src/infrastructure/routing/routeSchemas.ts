import type { RouteInfo } from "./routeInfo";

export type RouteSchemaConfig =
    | {
          path: string;
          void?: undefined;
          routeParams?: Record<string, any>;
          queryParams?: Record<string, any>;
          redirect?: () => any;
          anonymous?: boolean;
          noroot?: boolean;
          inner?: Record<string, RouteSchemaConfig>;
          sub?: Record<string, RouteSchemaConfig>;
      }
    | {
          path: string;
          void: true;
          routeParams?: undefined;
          queryParams?: undefined;
          anonymous?: undefined;
          noroot?: undefined;
          inner?: undefined;
          sub: Record<string, RouteSchemaConfig>;
      };

export type RouteSchemas<T extends Record<string, RouteSchemaConfig>> = Readonly<{
    [TKey in keyof T]: (T[TKey] extends { void: true }
        ? never
        : RouteInfo<
              T[TKey] extends { routeParams: any } ? T[TKey]["routeParams"] : undefined,
              T[TKey] extends { queryParams: any } ? T[TKey]["queryParams"] : undefined
          >) &
        (T[TKey] extends { sub: Record<string, RouteSchemaConfig> } ? RouteSchemas<T[TKey]["sub"]> : object) &
        (T[TKey] extends { inner: Record<string, RouteSchemaConfig> } ? RouteSchemas<T[TKey]["inner"]> : object);
}>;

export function defineRouteSchemas<T extends Record<string, RouteSchemaConfig>>(
    routes: T,
    options: {
        rootName?: string;
        rootPath: string;
        rootParams: () => Record<string, any>;
    },
): RouteSchemas<T> {
    const schemas: Partial<RouteSchemas<T>> = {};

    for (const key in routes) {
        const route = routes[key];

        const path = (route.noroot ? "" : options.rootPath) + "/" + route.path;
        const name = options.rootName && !route.noroot ? options.rootName + "." + key : key;
        const params = route.noroot ? () => ({}) : options.rootParams;

        if (route.void) {
            if (route.sub) {
                schemas[key] = defineRouteSchemas(route.sub!, {
                    rootName: name,
                    rootPath: path,
                    rootParams: params,
                }) as any;
            }
        } else {
            const to: Record<string, any> = (opt?: { routeParams: any; queryParams: any }) => ({
                name: key,
                params: {
                    ...params(),
                    ...opt?.routeParams,
                },
                query: opt?.queryParams,
            });

            Object.defineProperties(to, {
                name: { value: name },
                path: { value: path },
                isInner: { value: false },
                isAnonymous: { value: Boolean(route.anonymous) },
            });

            const inner = route.inner
                ? defineRouteSchemas(route.inner!, {
                      rootName: name,
                      rootPath: path,
                      rootParams: params,
                  })
                : {};

            for (const innerKey in inner) {
                (inner[innerKey] as RouteInfo<any, any>).to.isInner = true;
            }

            const sub = route.sub
                ? defineRouteSchemas(route.sub!, {
                      rootName: name,
                      rootPath: path,
                      rootParams: params,
                  })
                : {};

            schemas[key] = { ...inner, ...sub } as any;

            Object.defineProperty(schemas[key], "to", {
                value: to,
                enumerable: false,
            });
        }
    }

    return schemas as RouteSchemas<T>;
}
