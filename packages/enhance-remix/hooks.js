/**
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @param {{ store: Record<any, any>; }} state
 * @returns {unknown}
 */
export function useActionData(fn, state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.actionData ? store.actionData[fn._routeId] : undefined;
}

/**
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @param {{ store: Record<any, any>; }} state
 * @returns {unknown}
 */
export function useLoaderData(fn, state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.loaderData[fn._routeId];
}

/**
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @param {{ store: Record<any, any>; }} state
 */
export function useLocation(state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.location;
}

/**
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @param {{ store: Record<any, any>; }} state
 * @returns {unknown}
 */
export function useRouteError(fn, state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.errors[fn._routeId];
}

/**
 *
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @returns {string}
 */
export function useElementName(fn) {
	return fn._elementName;
}
