import { json, useLoaderData } from "enhance-remix";

import { loadDocument } from "../docs.js";

/**
 * @param {import("enhance-remix").LoaderFunctionArgs} args
 */
export function loader({ request }) {
	let url = new URL(request.url);
	let doc = loadDocument(url.pathname);

	if (!doc) {
		throw new Error("Home page doc not found");
	}

	return json({ doc });
}

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

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Index({ html, state }) {
	/** @type {import("enhance-remix").SerializeFrom<typeof loader>} */
	let { doc } = useLoaderData(Index, state);

	return html`
		<main>
			<article>${doc.html}</article>
		</main>
	`;
}
