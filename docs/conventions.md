---
title: Conventions
---

# Conventions

A lot of Enhance Remix APIs aren't imported from the "enhance-remix" packages, but are instead conventions and exports from your application modules. When you import from "enhance-remix", you are calling Remix, but these APIs are consumed when Remix calls your code.

## Filename Conventions

There are a few file conventions that Remix uses you should be aware of.

### Root Route

Your `app/root.js` file is an optional layout route that wraps all others in your `app/routes` directory.

You can export a `loader`, `action`, `meta`, or `links` function just like any other route.

This route should almost always render a `<slot></slot>` to allow the child routes to appear on the page.

### Routes Directory

Routes are nested based on the flat routes convention without escaping, and a splat is just a `*` instead of a single `$`.

## Route Module Conventions

## `default` export

This is the component that will render when the route matches.

```js
/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Index({ html, state }) {
	/** @type {import("enhance-remix").SerializeFrom<typeof loader>} */
	let { doc } = useLoaderData(Index, state);

	return html`
		<main>
			<article>
				<h1>Hello, World!</h1>
			</article>
		</main>
	`;
}
```

## `ErrorBoundary` export

See https://reactrouter.com/en/main/route/error-element

```js
/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export function ErrorBoundary({ html, state }) {
	let error = useRouteError(Root, state);

	let message = "Unknown error";
	if (error instanceof ErrorResponse) {
		message = "" + error.status;
	}

	return html`
		<main>
			<article>
				<h1>${message}</h1>
			</article>
		</main>
	`;
}
```

## `action` export

See https://reactrouter.com/en/main/route/action

```js
/**
 * @param {import("enhance-remix").LoaderFunctionArgs} args
 */
export async function action({ request }) {
	let formData = await request.formData();
	await createSomeElement(formData);
	return null;
}
```

## `links` export

See https://remix.run/api/conventions#links

```js
/** @type {import("enhance-remix").LinksFunction} */
export function links() {
	return [
		{
			rel: "stylesheet",
			href: "https://unpkg.com/awsm.css@3.0.7/dist/awsm.min.css",
		},
	];
}
```

## `meta` export

See https://remix.run/api/conventions#meta

```js
/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta({ data }) {
	return {
		lang: "en-us",
		title: (data && data.doc.attributes.title) || "Enhance Remix",
		description: "A useable site as the baseline.",
	};
}
```
