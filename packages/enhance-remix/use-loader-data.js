/**
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @param {{ store: Record<any, any>; }} state
 * @returns {unknown}
 */
export default function useLoaderData(fn, state) {
  /** @type {import("@remix-run/router").StaticHandlerContext} */
  let store = state.store;
  return store.loaderData[fn._routeId];
}
