import { Messages } from "./exceptions/index.js";
import { RouterException } from "./exceptions/index.js";

export enum METHOD {
	GET = "get",
	POST = "post",
	DELETE = "delete",
	PUT = "put",
	PATCH = "patch",
}
export type HANDLER =
	| [string, string]
	| (() => Promise<Response | string | number | any>)
	| (() => any);
export type ROUTE = {
	name?: string;
	path: string;
	method: METHOD;
	handler: HANDLER;
	middlewares: string[];
};

export default class Route {
	private _path: string;
	private _handler: HANDLER;
	private _method: METHOD;
	private _middlewares: string[] = [];
	private _name?: string;
	constructor(method: METHOD, path: string, handler: HANDLER) {
		this._method = method;
		this._path = path;
		if (!(typeof handler == "string" || Array.isArray(handler))) {
			throw new RouterException(Messages.invalid_handler_type);
		}
		this._handler = handler;
	}

	middleware(middlewares: string[]): Omit<Route, "middleware"> {
		for (const m of middlewares) {
			if (typeof m !== "string") {
				throw new RouterException(Messages.invalid_middleware_name);
			}
		}
		this._middlewares.push(...middlewares);
		return this;
	}

	name(name: string): Omit<Route, "name"> {
		name = name.trim();
		if (!name || name.length <= 0) {
			throw new RouterException(Messages.invalid_route_name);
		}
		this._name = name;
		return this;
	}
}

new Route(METHOD.GET, "", ["", ""]).name("");
