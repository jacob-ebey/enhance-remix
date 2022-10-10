/**
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @param {{ store: Record<any, any>; }} state
 * @returns {unknown}
 */
export default function useActionData(fn, state) {
	/** @type {import("@remix-run/router").StaticHandlerContext} */
	let store = state.store;
	return store.actionData ? store.actionData[fn._routeId] : undefined;
}
