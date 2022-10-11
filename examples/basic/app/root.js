import { ErrorResponse, useLocation, useRouteError } from "enhance-remix";

import Header from "./components/header.js";

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta() {
	return {
		lang: "en-us",
		viewport: "width=device-width,initial-scale=1",
		title: "Enhance Remix",
		description: "A useable site as the baseline.",
	};
}

/** @type {import("enhance-remix").LinksFunction} */
export function links() {
	return [
		{
			rel: "stylesheet",
			href: "https://unpkg.com/awsm.css@3.0.7/dist/awsm.min.css",
		},
	];
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Root({ html, state }) {
	let { pathname } = useLocation(state);

	return html`
		${Header({ pathname })}
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
		${Header({ pathname })}
		<main>
			<article>
				<h1>${message}</h1>
				<p>Head on over to the docs <a href="/docs">here</a>.</p>
			</article>
		</main>
	`;
}
