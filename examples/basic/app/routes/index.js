import { json, useLoaderData } from "enhance-remix";

/**
 * @param {import("enhance-remix/enhance-remix").LoaderFunctionArgs} args
 */
export function loader({ request }) {
	let url = new URL(request.url);
	let greeting = url.searchParams.get("greeting") || undefined;
	if (greeting) {
		greeting = greeting.trim() || undefined;
	}

	return json({ greeting });
}

export function action({}) {
	return null;
}

/**
 * @arg {import("enhance-remix/enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta({ data }) {
	return {
		lang: "en-us",
		title: data.greeting || "Hello World!",
		description: "This is the description",
	};
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Index({ html, state }) {
	/** @type {import("enhance-remix/enhance-remix").SerializeFrom<typeof loader>} */
	let { greeting } = useLoaderData(Index, state);

	return html`
		<h2>Home!!!</h2>
		<hello-world ${greeting ? `greeting=${greeting}` : ""}></hello-world>
		<remix-form>
			<input type="text" name="greeting" value=${greeting} />
		</remix-form>
	`;
}
