import { json, useElementName, useLoaderData } from "enhance-remix";

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
	let elementName = useElementName(Index);

	/** @type {import("enhance-remix/enhance-remix").SerializeFrom<typeof loader>} */
	let { greeting } = useLoaderData(Index, state);

	return html`
		<header></header>
		<main>
			<article>
				<h2>Home!!!</h2>
				<hello-world
					${greeting ? `greeting=${JSON.stringify(greeting)}` : ""}
				></hello-world>
				<remix-form replace>
					<input
						type="text"
						name="greeting"
						value=${JSON.stringify(greeting)}
					/>
				</remix-form>
				<span hidden>Loading...</span>
			</article>
		</main>

		<style scope="global">
			${elementName} > header {
				margin-bottom: 3.5em;
			}
		</style>

		<script type="module">
			class IndexRouteElement extends HTMLElement {
				constructor() {
					super();
					this.loading = this.querySelector("span");
				}

				connectedCallback() {
					if (this.unsubscribe) {
						this.unsubscribe();
					}

					this.unsubscribe = window.useNavigation((navigation) => {
						if (navigation.state == "loading") {
							this.loading.hidden = false;
						} else {
							this.loading.hidden = true;
						}
					});
				}

				disconnectedCallback() {
					if (this.unsubscribe) {
						this.unsubscribe();
						this.unsubscribe = undefined;
					}
				}
			}

			if (!customElements.get(${JSON.stringify(elementName)})) {
				customElements.define(
					${JSON.stringify(elementName)},
					IndexRouteElement
				);
			}
		</script>
	`;
}
