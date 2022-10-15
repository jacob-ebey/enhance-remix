---
title: Getting Started
---

# Welcome!

## Why would I want this?

- a useable site becomes the baseline as it always should have been.
- no JavaScript by default
- sensible conventions
- standardized way to handle forms

## Setup

Create a new directory and initialize a new NPM project:

```bash
mkdir new-project
cd new-project
npm init -y
```

Install dependencies:

```bash
npm i enhance-remix enhance-remix-node
```

Install nodemon for reloading on change:

```bash
npm i -D nodemon
```

Install types for auto-complete:

```bash
npm i -D @enhance/types @types/node
```

Update your `package.json` to be a module package:

```json
{
	"type": "module"
}
```

Add the following script to your `package.json` to reload in dev mode:

For Node.js:

```json
{
	"scripts": {
		"dev": "nodemon --watch app server.js"
	}
}
```

For Bun:

```json
{
	"scripts": {
		"dev": "nodemon --watch app --exec \"bun run\" server.js"
	}
}
```

Create a `server.js`:

For Node.js:

```js
import * as http from "http";

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
```

For Bun:

```js
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
console.log(`Listening on port http://localhost:${port}`);
```

Create your first route at `app/routes/index.js`:

```js
import { json, useLoaderData } from "enhance-remix";

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta({ data }) {
	return {
		title: "Enhance Remix",
	};
}

/**
 * @param {import("enhance-remix").LoaderFunctionArgs} args
 */
export function loader(args) {
	return json({ message: "Hello, World!" });
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Index({ html, state }) {
	/** @type {import("enhance-remix").SerializeFrom<typeof loader>} */
	let { message } = useLoaderData(Index, state);

	return html`
		<main>
			<article>
				<h1>${message}</h1>
			</article>
		</main>
	`;
}
```

Start your app in development mode and get coding:

```bash
npm run dev
```
