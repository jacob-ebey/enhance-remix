import { type RequestListener } from "http";
import { type RequestHandler } from "enhance-remix";
import { type EnhanceElemFn } from "@enhance/types";

/**
 * Create a node http server request listener from a Fetch API request handler.
 * @param handler The handler you wish to run in the node environment
 */
export function createRequestListener(handler: RequestHandler): RequestListener;

/**
 * Load the elements that can be used in the app.
 * @param rootDir defaults to process.cwd()
 * @param appDir defaults to "app"
 * @param elementsDir defaults to "elements"
 */
export function loadElements(
	rootDir?: string,
	appDir?: string,
	elementsDir?: string
): Promise<Record<string, EnhanceElemFn>>;

/**
 * Load the routes for the app.
 * @param rootDir defaults to process.cwd()
 * @param appDir defaults to "app"
 * @param routesDir defaults to "routes"
 */
export function loadRoutes(
	rootDir?: string,
	appDir?: string,
	routesDir?: string
): Promise<AgnosticDataRouteObject[]>;
