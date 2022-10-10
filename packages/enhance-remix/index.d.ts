import { type AgnosticDataRouteObject } from "@remix-run/router";

export {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/router";

export type RequestHandler = (request: Request) => Promise<Response>;

export function createRequestHandler(
  routes: AgnosticDataRouteObject[],
  elements: unknown
): RequestHandler;
