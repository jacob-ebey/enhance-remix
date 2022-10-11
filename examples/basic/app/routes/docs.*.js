import { json, useLoaderData } from "enhance-remix";

import { loadDocument } from "../docs.js";

/**
 * @param {import("enhance-remix").LoaderFunctionArgs} args
 */
export function loader({ request }) {
	let url = new URL(request.url);
	let doc = loadDocument(url.pathname);

	if (!doc) {
		throw json("Not found", { status: 404 });
	}

	return json({ doc });
}

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta({ data }) {
	return {
		lang: "en-us",
		title:
			data && data.doc.attributes.title
				? `${data.doc.attributes.title} | Enhance Remix`
				: "Enhance Remix",
		description: "A useable site as the baseline.",
	};
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Doc({ html, state }) {
	/** @type {import("enhance-remix").SerializeFrom<typeof loader>} */
	let { doc } = useLoaderData(Doc, state);

	return html` <article>${doc.html}</article> `;
}
