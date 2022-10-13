import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

import { ErrorResponse, useLocation, useRouteError } from "enhance-remix";

import Header from "./components/header.js";

const require = createRequire(import.meta.url);
const awsmStyles = fs.readFileSync(
	path.resolve(require.resolve("awsm.css"), "../dist/awsm.css"),
	"utf8"
);

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta() {
	return {
		lang: "en-us",
		charset: "utf-8",
		viewport: "width=device-width,initial-scale=1",
		title: "Enhance Remix",
		description: "A useable site as the baseline.",
	};
}

/** @type {import("enhance-remix").LinksFunction} */
export function links() {
	return [
		{
			rel: "icon",
			href: "https://remix.run/favicon-light.1.png",
			type: "image/png",
			media: "(prefers-color-scheme: light)",
		},
		{
			rel: "icon",
			href: "https://remix.run/favicon-dark.1.png",
			type: "image/png",
			media: "(prefers-color-scheme: dark)",
		},
	];
}

function Styles() {
	return /*html*/ `
		<style>${awsmStyles}</style>
		<style>
			ul, p+ul {
				margin-top: 1em;
				margin-bottom: 1em;
			}
		</style>
	`;
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Root({ html, state }) {
	let { pathname } = useLocation(state);

	return html`
		${Styles()} ${Header({ pathname })}
		<slot></slot>
	`;
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export function ErrorBoundary({ html, state }) {
	let { pathname } = useLocation(state);
	let error = useRouteError(Root, state);

	let message = "Unknown error";
	if (error instanceof ErrorResponse) {
		message = "" + error.status;
	}

	return html`
		${Styles()} ${Header({ pathname })}
		<main>
			<article>
				<h1>${message}</h1>
				<p>Head on over to the docs <a href="/docs">here</a>.</p>
			</article>
		</main>
	`;
}
