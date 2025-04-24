import Route, { HANDLER, METHOD } from "./route.js";

export default class Router {
	private static __routes__: Route[] = [];

	public static get(path: string, handler: HANDLER):Route {
		const __current_route = new Route(METHOD.GET, path, handler);
		this.__routes__.push(__current_route);
		return __current_route;
	}


}
