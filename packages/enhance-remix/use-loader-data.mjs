/**
 *
 * @param {import("@enhance/types").EnhanceElemFn} fn
 * @param {{ store: Record<any, any>; }} state
 * @returns {unknown}
 */
export default function useLoaderData(fn, state) {
  return state.store.loaderData[fn._routeId];
}
