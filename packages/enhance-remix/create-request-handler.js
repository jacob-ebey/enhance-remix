import enhance from "@enhance/ssr";
import {
	unstable_createStaticHandler as createStaticHandler,
	ErrorResponse,
} from "@remix-run/router";

import { RemixForm } from "./elements.js";

/**
 *
 * @param {import("@remix-run/router").AgnosticDataRouteObject[]} routes
 * @param {unknown} elements
 * @returns {import("./enhance-remix").RequestHandler}
 */
export default function createRequestHandler(routes, elements) {
	let rootRoute = false;
	function recurseRoutesAndAssignId(route) {
		if (route.element) {
			route.element._elementName = "route-" + createElementName(route.id);
		}
		if (route.children) {
			route.children.forEach(recurseRoutesAndAssignId);
		}
	}
	for (let route of routes) {
		if (route.id == "root") {
			rootRoute = route;
		}

		recurseRoutesAndAssignId(route);
	}
	return async (request) => {
		let staticHandler = createStaticHandler(routes);
		let context = await staticHandler.query(request);

		if (context instanceof Response) {
			return context;
		}

		if (context.matches[0].route.id == "__shim-404-route__") {
			if (!rootRoute) {
				return new Response(
					/*html*/ `<!DOCTYPE>
<html>
<head>
	<meta charset="utf-8">
	<title>404 Not Found</title>
</head>
<body>
	<main>
		<article>
			<h1>404 Not Found</h1>
			<p>Export an <code>ErrorBoundary</code> from your root route to handle 404's.</p>
		</article>
	</main>
</html>
`,
					{ status: 404 }
				);
			}

			let url = new URL(request.url);
			context.matches = [
				{
					params: {},
					pathname: url.pathname,
					route: rootRoute,
				},
			];
			context.errors = {
				root: new ErrorResponse(404, "Not Found", null),
			};
		}

		let finalElements = {
			...elements,
			"remix-form": RemixForm,
		};

		let links = "";

		for (let i = 0; i < context.matches.length; i++) {
			let match = context.matches[i];
			finalElements[`route-${createElementName(match.route.id)}`] =
				match.route.element;

			if (match.route.errorElement) {
				finalElements[`error-route-${createElementName(match.route.id)}`] =
					match.route.errorElement;
			}

			if (match.route.links) {
				/** @type {import("./enhance-remix").LinkDescriptor} */
				let routeLinks =
					typeof match.route.links == "function"
						? match.route.links()
						: match.route.links;

				for (let link of routeLinks) {
					if (!link) continue;

					links += `<link ${Object.entries(link)
						.map(([key, value]) => `${key}=${JSON.stringify(String(value))}`)
						.join(" ")}>`;
				}
			}
		}

		let html = enhance({
			elements: finalElements,
			initialState: context,
		});

		let leafMatch = context.matches.slice(-1)[0];
		let { [leafMatch.route.id]: _, ...parentData } = context.loaderData;
		/** @type {import("./enhance-remix").MetaFunction} */
		let metaExport = leafMatch.route.meta;
		let metaObject =
			typeof metaExport == "function"
				? metaExport({
						data: context.loaderData[leafMatch.route.id],
						location: context.location,
						params: leafMatch.params,
						parentData,
				  })
				: metaExport;

		let head = "";
		let lang;
		if (metaObject) {
			for (let [name, value] of Object.entries(metaObject)) {
				if (!value) continue;

				if (["charset", "charSet"].includes(name)) {
					head += `<meta key="charset" charSet=${JSON.stringify(
						String(value)
					)}>`;
					continue;
				}

				if (name === "title") {
					head += `<title key="title">${String(value)}</title>`;
					continue;
				}

				if (name == "lang") {
					lang = value;
					continue;
				}

				let isOpenGraphTag = name.startsWith("og:");

				for (let content of [value].flat()) {
					if (isOpenGraphTag) {
						head += `<meta property="${name}" content=${JSON.stringify(
							String(content)
						)}>`;
						continue;
					}

					if (typeof content == "string") {
						head += `<meta name="${name}" content=${JSON.stringify(
							String(content)
						)}">`;
						continue;
					}

					head += `<meta ${Object.entries(content)
						.map(([name, value]) => `${name}=${JSON.stringify(String(value))}`)
						.join(" ")}>`;
				}
			}
		}

		let matchesToRender = [];
		for (let match of context.matches) {
			if (context.errors && match.route.id in context.errors) {
				matchesToRender.push(match);
				break;
			}
			matchesToRender.push(match);
		}

		let markup = "";
		for (let i = matchesToRender.length - 1; i >= 0; i--) {
			let match = matchesToRender[i];
			let elementName = createElementName(match.route.id);
			if (context.errors && match.route.id in context.errors) {
				markup = `<error-route-${elementName}></error-route-${elementName}>`;
				continue;
			}
			markup = `<route-${elementName}>${markup}</route-${elementName}>`;
		}

		let body = html`<!DOCTYPE html>
			<html ${lang ? `lang=${lang}` : ""}>
				<head>
					${links} ${head}
				</head>
				<body>
					${markup}

					<script>
						window._transitions = window._transitions || [];
						window._navigationCallbacks =
							window._navigationCallbacks || new Set();

						window._getNavigation = function getNavigation() {
							let transition = window._transitions.slice(-1)[0];
							if (!transition) {
								return { state: "idle" };
							}

							return {
								state: transition.method === "GET" ? "loading" : "submitting",
								formData: transition.formData,
								url: transition.url,
							};
						};

						window.useNavigation = function useNavigation(cb) {
							window._navigationCallbacks.add(cb);
							return () => {
								window._navigationCallbacks.delete(cb);
							};
						};
					</script>
				</body>
			</html> `;

		// TODO: Render using enhance-ssr
		return new Response(body, {
			status: context.statusCode,
			headers: {
				"Content-Type": "text/html",
			},
		});
	};
}

function createElementName(id) {
	return id.replace(/[^a-z0-9\$]/gi, "-");
}
