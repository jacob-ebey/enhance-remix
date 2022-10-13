---
title: API
---

# API

Because everything is standards based, most of the time you will want to be referencing [MDN](https://developer.mozilla.org/), but we do expose a few utilities that make life just a little better.

## Elements

### `<remix-form>`

The `<remix-form>` component is a declarative way to perform data mutations: creating, updating, and deleting data. While it might be a mind-shift to think about these tasks as "navigation", it's how the web has handled mutations since before JavaScript was created!

```js
/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Example({ html }) {
	return html`
		<remix-form>
			<fieldset>
				<legend>Say Hello</legend>

				<label>
					<span>Name</span>
					<input type="text" name="name" />
				</label>

				<button type="submit">Submit</button>
			</fieldset>
		</remix-form>
	`;
}
```

After a `<remix-form>` submission, the page will reload, or perform a simulated reload based on the `replace` attribute.

You can build "optimistic UI" and pending indicators with [useNavigation](#usenavigation)

## Hooks

### `useNavigation`

This hook tells you everything you need to know about a page transition to build pending navigation indicators and optimistic UI on data mutations. Things like:

- Global loading spinners
- Spinners on clicked links
- Disabling forms while the mutation is happening
- Adding spinners to submit buttons
- Optimistically showing a new record while it's being created on the server
- Optimistically showing the new state of a record while it's being updated

```js
import { useElementName } from "enhance-remix";

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Example({ html }) {
	return html`
		<remix-form>
			<fieldset>
				<legend>Say Hello</legend>

				<label>
					<span>Name</span>
					<input type="text" name="name" />
				</label>

				<button type="submit">Submit</button>
			</fieldset>
		</remix-form>

		<script type="module">
			class GetFormElementRoute extends HTMLElement {
				constructor() {
					super();
					this.button = this.querySelector("button");
				}

				connectedCallback() {
					if (this.unsubscribe) {
						this.unsubscribe();
					}

					this.unsubscribe = window.useNavigation((navigation) => {
						if (navigation.state == "loading") {
							this.button.disabled = true;
						} else {
							this.button.disabled = false;
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
					GetFormElementRoute
				);
			}
		</script>
	`;
}
```
