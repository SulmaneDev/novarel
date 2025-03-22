import Route, { Fn, Handler, MethodType } from "./route.js";

export default class Router {
    private static routes: Route[] = [];
    private static prefix: string;
    public static get(path: string, handler: Handler) {
        const currentRoute = new Route({
            method: "get",
            path,
            handler,
        });
        this.routes.push(currentRoute);
        return currentRoute;
    }

    public static post(path: string, handler: Handler) {
        const currentRoute = new Route({
            method: "post",
            path,
            handler,
        });
        this.routes.push(currentRoute);
        return currentRoute;
    }

    public static put(path: string, handler: Handler) {
        const currentRoute = new Route({
            method: "put",
            path,
            handler,
        });
        this.routes.push(currentRoute);
        return currentRoute;
    }

    public static patch(path: string, handler: Handler) {
        const currentRoute = new Route({
            method: "patch",
            path,
            handler,
        });
        this.routes.push(currentRoute);
        return currentRoute;
    }

    public static delete(path: string, handler: Handler) {
        const currentRoute = new Route({
            method: "delete",
            path,
            handler,
        });
        this.routes.push(currentRoute);
        return currentRoute;
    }

    public static match(methods: MethodType[], path: string, handler: Handler) {
        const routes = methods.map((method) => {
            const route = new Route({ method, path, handler });
            this.routes.push(route);
            return route;
        });
        return routes;
    }

    public static any(path: string, handler: Handler) {
        const methods: MethodType[] = [
            "get",
            "post",
            "put",
            "patch",
            "delete",
            "options",
            "head",
        ];
        return this.match(methods, path, handler);
    }

    static setPrefix(prefix: string, group: Fn) {
        this.prefix = prefix;
        group();
    }

    public static getRoutes(): Route[] {
        return this.routes;
    }
}

