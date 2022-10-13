import * as http from "http";

import { createRequestHandler } from "enhance-remix";
import {
	loadElements,
	loadRoutes,
	createRequestListener,
} from "enhance-remix-node";
import compression from "compression";

let routes = await loadRoutes();
let elements = await loadElements();

let handler = createRequestHandler(routes, elements);
let requestListener = createRequestListener(handler);

let server = http.createServer((req, res) => {
	compression()(req, res, () => {
		requestListener(req, res);
	});
});

let port = Number(process.env.PORT || "3000");
server.listen(port, () => {
	console.log(`Listening on port http://localhost:${port}`);
});
