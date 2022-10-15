import * as http from "http";

import { createRequestHandler } from "enhance-remix";
import {
	loadElements,
	loadRoutes,
	createRequestListener,
} from "enhance-remix-node";
import compression from "compression";
import * as esbuild from "esbuild";

let routes = await loadRoutes();
let elements = await loadElements();

let handler = createRequestHandler(routes, elements, {
	scriptTransforms: [
		({ attrs, raw }) => {
			let lang = attrs.find((a) => a.name == "lang");
			lang = lang && lang.value;
			let type = attrs.find((a) => a.name == "type");
			type = type && type.value;
			let loader = lang == "ts" ? "ts" : "js";
			let format = type == "module" ? "esm" : "iife";
			let result = esbuild.transformSync(raw, {
				loader,
				format,
				target: "es2019",
				minify: true,
			});

			return result.code;
		},
	],
	styleTransforms: [
		({ raw }) => {
			let result = esbuild.transformSync(raw, {
				loader: "css",
				minify: true,
			});

			return result.code;
		},
	],
});
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
