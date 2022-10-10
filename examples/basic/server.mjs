import * as http from "node:http";

import { createRequestHandler } from "enhance-remix";
import { loadRoutes, createRequestListener } from "enhance-remix-node";

let routes = await loadRoutes();

let handler = createRequestHandler(routes);
let requestListener = createRequestListener(handler);

let server = http.createServer(requestListener);

server.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
