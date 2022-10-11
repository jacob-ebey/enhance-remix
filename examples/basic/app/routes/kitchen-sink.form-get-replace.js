import { useElementName, useLocation } from "enhance-remix";

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function GetFormReplace({ html, state }) {
	let elementName = useElementName(GetFormReplace);

	let location = useLocation(state);
	let searchParams = new URLSearchParams(location.search);
	let name = searchParams.get("name");

	return html`
		<h1>GET Form (replace)</h1>

		<p>Hello, ${name || "World"}!</p>

		<remix-form replace>
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
				href="https://github.com/jacob-ebey/enhance-remix/blob/main/examples/basic/app/routes/kitchen-sink.form-get-replace.js"
				rel="noopener noreferrer"
				target="_blank"
			>
				View on GitHub
			</a>
		</p>

		<script type="module">
			class GetFormReplaceElementRoute extends HTMLElement {
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
						if (navigation.state == "loading") {
							this.button.disabled = true;
							this.legend.textContent = "Loading...";
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
					GetFormReplaceElementRoute
				);
			}
		</script>
	`;
}
