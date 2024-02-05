import type { RouteInfo } from "./routeInfo";
import type { Component } from "vue";

export type RoutePageConfig = {
    route: RouteInfo<any, any>,
    component: Component | (() => Promise<Component>),
};

export type RoutePages = {
    name: string,
    component: Component | (() => Promise<Component>),
}[];

export function definePages(pages: RoutePageConfig[]): RoutePages {
    return pages.map(x => ({
        name: x.route.to.name,
        component: x.component,
    }));
}
