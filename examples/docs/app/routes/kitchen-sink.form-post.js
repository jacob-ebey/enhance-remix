import { json, useActionData, useElementName } from "enhance-remix";

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta() {
	return {
		title: "POST Form | KitchenSink | Enhance Remix",
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
export default function PostForm({ html, state }) {
	let elementName = useElementName(PostForm);

	let { name } = useActionData(PostForm, state) || {};

	return html`
		<h1>POST Form</h1>

		<p>Hello, ${name || "World"}!</p>

		<remix-form method="post">
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
				href="https://github.com/jacob-ebey/enhance-remix/blob/main/examples/docs/app/routes/kitchen-sink.form-post.js"
				rel="noopener noreferrer"
				target="_blank"
			>
				View on GitHub
			</a>
		</p>

		<script type="module">
			class PostFormElementRoute extends HTMLElement {
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
					PostFormElementRoute
				);
			}
		</script>
	`;
}
