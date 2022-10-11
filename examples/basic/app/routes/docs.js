import { json, useLoaderData } from "enhance-remix";

import { loadDocument } from "../docs.js";

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta({ data }) {
	return {
		title:
			data && data.doc && data.doc.attributes.title
				? `${data.doc.attributes.title} | Enhance Remix`
				: "Enhance Remix",
		description:
			(data && data.doc && data.doc.attributes.description) ||
			"A useable site as the baseline.",
	};
}

/**
 * @param {import("enhance-remix").LoaderFunctionArgs} args
 */
export function loader({ request }) {
	let url = new URL(request.url);

	if (url.pathname != "/docs") {
		return json({});
	}

	let doc = loadDocument("/docs");

	if (!doc) {
		throw json("Not found", { status: 404 });
	}

	return json({ doc });
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Docs({ html, state }) {
	/** @type {import("enhance-remix").SerializeFrom<typeof loader>} */
	let { doc } = useLoaderData(Docs, state);

	return html`
		<main>
			<nav>
				<ul>
					<li><a href="/docs">Overview</a></li>
					<li><a href="/docs/conventions">Conventions</a></li>
				</ul>
			</nav>
			${doc ? `<article>${doc.html}</article>` : `<slot></slot>`}
		</main>
	`;
}
