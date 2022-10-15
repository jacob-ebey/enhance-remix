/** @type {import("./hooks").useActionData} */
export function useActionData(fn, state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.actionData ? store.actionData[fn._routeId] : undefined;
}

/** @type {import("./hooks").useLoaderData} */
export function useLoaderData(fn, state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.loaderData[fn._routeId];
}

/** @type {import("./hooks").useLocation} */
export function useLocation(state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.location;
}

/** @type {import("./hooks").useRouteError} */
export function useRouteError(fn, state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.errors[fn._routeId];
}

/** @type {import("./hooks").useElementName} */
export function useElementName(fn) {
	return fn._elementName;
}
