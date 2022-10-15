export type RequestHandler = (request: Request) => Promise<Response>;

export type TransformArgs = {
	attrs: { name: string; value: string }[];
	raw: string;
};

export type Transform = (args: TransformArgs) => string;

export type CreateRequestHandlerOptions = {
	scriptTransforms?: Transform[];
	styleTransforms?: Transform[];
};

export function createRequestHandler(
	routes: AgnosticDataRouteObject[],
	elements: Record<string, unknown>,
	options?: CreateRequestHandlerOptions
): RequestHandler;
