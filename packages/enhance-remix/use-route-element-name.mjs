export default function useRouteElementName(fn) {
  return JSON.stringify("route-" + fn._elementName);
}
