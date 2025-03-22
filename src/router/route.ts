export type Fn = () => any;
export type Handler = [string, string] | Fn[] | Fn;
export type MethodType =
    | "get"
    | "put"
    | "patch"
    | "delete"
    | "options"
    | "head"
    | "trace"
    | "post";

export type RouteType = {
    prefix?: string;
    path: string;
    method: MethodType;
    handler: Handler;
    name?: string;
    middlewares?: string[];
    subdomain?: string;
    fallback?: Handler;
};

export default class Route {
    protected currentRoute: RouteType;
    constructor(route: RouteType) {
        this.currentRoute = route;
    }
    middleware(middlewares:string[]) {
        this.currentRoute.middlewares?.push(...middlewares);
    }
    name(name:string) {
        this.currentRoute.name=name;
    }
}
