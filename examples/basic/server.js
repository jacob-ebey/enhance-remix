import * as http from "node:http";

import { createRequestHandler } from "enhance-remix";
import {
	loadElements,
	loadRoutes,
	createRequestListener,
} from "enhance-remix-node";

let routes = await loadRoutes();
let elements = await loadElements();

let handler = createRequestHandler(routes, elements);
let requestListener = createRequestListener(handler);

let server = http.createServer(requestListener);

let port = Number(process.env.PORT || "3000");
server.listen(port, () => {
	console.log(`Listening on port http://localhost:${port}`);
});
