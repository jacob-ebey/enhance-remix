import { ErrorResponse, useLocation, useRouteError } from "enhance-remix";

/** @type {import("enhance-remix").LinksFunction} */
export function links() {
	return [
		{
			rel: "stylesheet",
			href: "https://unpkg.com/awsm.css@3.0.7/dist/awsm.min.css",
		},
	];
}

function Header({ pathname }) {
	return /*html*/ `
		<header class="header">
			<h1>Enhance Remix</h1>
			<p>A useable site as the baseline.</p>
			<nav>
				<ul>
					<li>
						<a href="/" ${pathname == "/" ? 'aria-current="page"' : ""}>Home</a>
					</li>
					<li>
						<a href="/docs" ${pathname == "/docs" ? 'aria-current="page"' : ""}
							>Docs</a
						>
					</li>
				</ul>
			</nav>
		</header>

		<style>
			.header h1 {
				margin: 0;
				font-size: 1.5em;
			}
			.header p {
				margin: 0;
				font-size: 0.85em;
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
		${Header({ pathname })}
		<slot></slot>
		<script>
			console.log("test");
		</script>
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
