import type { RouteRecordRaw } from "vue-router";
import type { RouteSchemas } from "./routeSchemas";
import type { RoutePages } from "./routePages";

export function initializeRoutes(
    routes: RouteSchemas<any>,
    pages: RoutePages,
    parent?: RouteRecordRaw,
): RouteRecordRaw[] {
    const rawList: RouteRecordRaw[] = [];

    for (const key in routes) {
        const route = routes[key];
        let raw: RouteRecordRaw | undefined;

        if (route.to) {
            const page = pages.find((x) => x.name === route.to.name);
            if (page == null) {
                console.error("Не найдена страница для роута " + route.to.name);
                continue;
            }

            raw = {
                name: route.to.name,
                path: (parent?.path ?? "") + route.to.path,
                component: page.component,
                children: [],
                meta: { info: route },
            };

            (route.to.isInner ? parent!.children! : rawList).push(raw);
        }

        initializeRoutes(route as RouteSchemas<any>, pages, raw);
    }

    return rawList;
}
