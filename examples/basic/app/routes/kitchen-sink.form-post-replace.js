import { json, useActionData, useElementName } from "enhance-remix";

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta() {
	return {
		lang: "en-us",
		title: "POST Form (replace) | KitchenSink | Enhance Remix",
		description: "A useable site as the baseline.",
	};
}

/**
 * @param {import("enhance-remix").ActionFunctionArgs} args
 */
export async function action({ request }) {
	let formData = await request.formData();
	let name = formData.get("name");
	name = typeof name == "string" ? name : undefined;

	return json({ name });
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function PostFormReplace({ html, state }) {
	let elementName = useElementName(PostFormReplace);

	let { name } = useActionData(PostFormReplace, state) || {};

	return html`
		<h1>POST Form (replace)</h1>

		<p>Hello, ${name || "World"}!</p>

		<remix-form method="post" replace>
			<fieldset>
				<legend>Say Hello</legend>

				<label>
					<span>Name</span>
					<input type="text" name="name" />
				</label>

				<button type="submit">Submit</button>
			</fieldset>
		</remix-form>

		<p>
			<a
				href="https://github.com/jacob-ebey/enhance-remix/blob/main/examples/basic/app/routes/kitchen-sink.form-post-replace.js"
				rel="noopener noreferrer"
				target="_blank"
			>
				View on GitHub
			</a>
		</p>

		<script type="module">
			class PostFormReplaceElementRoute extends HTMLElement {
				constructor() {
					super();
					this.button = this.querySelector("button");
					this.legend = this.querySelector("legend");
				}

				connectedCallback() {
					if (this.unsubscribe) {
						this.unsubscribe();
					}
					this.unsubscribe = window.useNavigation((navigation) => {
						if (navigation.state == "submitting") {
							this.button.disabled = true;
							this.legend.textContent = "Submitting...";
						} else {
							this.button.disabled = false;
							this.legend.textContent = "Say Hello";
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
					PostFormReplaceElementRoute
				);
			}
		</script>
	`;
}
