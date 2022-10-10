import { type AgnosticDataRouteObject } from "@remix-run/router";

export type RequestHandler = (request: Request) => Promise<Response>;

export function createRequestHandler(
  routes: AgnosticDataRouteObject[]
): RequestHandler;
