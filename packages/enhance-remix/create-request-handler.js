import enhance from "@enhance/ssr";
import { unstable_createStaticHandler as createStaticHandler } from "@remix-run/router";

import { RemixForm } from "./elements.js";

/**
 *
 * @param {import("@remix-run/router").AgnosticDataRouteObject[]} routes
 * @param {unknown} elements
 * @returns {import("./enhance-remix").RequestHandler}
 */
export default function createRequestHandler(routes, elements) {
	function recurseRoutesAndAssignId(route) {
		if (route.element) {
			route.element._elementName = "route-" + createElementName(route.id);
		}
		if (route.children) {
			route.children.forEach(recurseRoutesAndAssignId);
		}
	}
	for (let route of routes) {
		recurseRoutesAndAssignId(route);
	}
	return async (request) => {
		let staticHandler = createStaticHandler(routes);
		let context = await staticHandler.query(request);

		if (context instanceof Response) {
			return context;
		}

		if (context.matches[0].route.id == "__shim-404-route__") {
			return new Response("Not Found", { status: 404 });
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

			if (match.route.links) {
				/** @type {import("./enhance-remix").LinkDescriptor} */
				let routeLinks =
					typeof match.route.links == "function"
						? match.route.links()
						: match.route.links;

				for (let link of routeLinks) {
					if (!link) continue;

					links += `<link ${Object.entries(link)
						.map(([key, value]) => `${key}=${value}`)
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
					head += `<meta key="charset" charSet={value as string}>`;
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
						head += `<meta key="${name}" property="${name}" content="${String(
							content
						)}">`;
						continue;
					}

					if (typeof content == "string") {
						head += `<meta name="${name}" content="${content}">`;
						continue;
					}

					head += `<meta ${Object.entries(content)
						.map(([name, value]) => `${name}="${value}"`)
						.join(" ")}>`;
				}
			}
		}

		head += html`
			<script>
				function getNavigation() {
					let transition = window._transitions.slice(-1)[0];
					if (!transition) {
						return { state: "idle" };
					}

					return {
						state: transition.method === "GET" ? "loading" : "submitting",
						formData: transition.formData,
						url: transition.url,
					};
				}
				window._getNavigation = getNavigation;
				window._transitions = window._transitions || [];
				window._navigationCallbacks = window._navigationCallbacks || new Set();
				window.useNavigation =
					window.useNavigation ||
					function useNavigation(cb) {
						window._navigationCallbacks.add(cb);
						return () => {
							window._navigationCallbacks.delete(cb);
						};
					};
			</script>
		`;

		let body = html([
			`<!DOCTYPE html><html ${
				lang ? `lang=${lang}` : ""
			}><head>${links}${head}</head><body>` +
				context.matches.reduceRight((acc, match, index) => {
					return match.route.element
						? `<route-${createElementName(
								match.route.id
						  )}>${acc}</route-${index}>`
						: acc;
				}, "") +
				"</body></html>",
		]);

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
