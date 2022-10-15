/// <reference types="bun-types" />

import { createRequestHandler } from "enhance-remix";
import { loadElements, loadRoutes } from "enhance-remix-bun";

let routes = await loadRoutes();
let elements = await loadElements();

let handler = createRequestHandler(routes, elements);

let port = Number(process.env.PORT || "3000");
let server = Bun.serve({
	fetch: (request) => {
		// @ts-expect-error
		request.signal = new AbortController().signal;
		return handler(request);
	},
	port,
});
console.log(`Listening on port http://localhost:${server.port}`);
