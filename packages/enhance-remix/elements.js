/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export function RemixForm({ html, state }) {
	let { attrs } = state;

	return html`
		<form
			${Object.entries(attrs)
				.map(([name, value]) =>
					value ? `${name}=${JSON.stringify(String(value))}` : ""
				)
				.join(" ")}
		>
			<slot></slot>
		</form>

		<script type="module">
			function emitChange() {
				let navigation = window._getNavigation();
				window._navigationCallbacks.forEach((cb) => cb(navigation));
			}

			class RemixFormElement extends HTMLElement {
				constructor() {
					super();
					this.form = this.querySelector("form");

					this.form.addEventListener("submit", (event) => {
						let replace = typeof this.getAttribute("replace") == "string";

						let target = event.submitter || event.currentTarget;

						let action, method, enctype, formData;

						if (isFormElement(target)) {
							action =
								target.getAttribute("action") ||
								this.form.getAttribute("action");
							method =
								target.getAttribute("method") ||
								this.form.getAttribute("method") ||
								this.form.method;
							method = method.toUpperCase();
							enctype =
								target.getAttribute("enctype") ||
								this.form.getAttribute("enctype") ||
								this.form.enctype;
							formData = new FormData(target);
						} else if (
							isButtonElement(target) ||
							(isInputElement(target) &&
								(target.type === "submit" || target.type === "image"))
						) {
							let form = target.form;

							if (form == null) {
								throw new Error("Cannot submit a <button> without a <form>");
							}

							method =
								target.getAttribute("formmethod") ||
								form.getAttribute("method") ||
								this.form.method;
							method = method.toUpperCase();
							action =
								target.getAttribute("formaction") ||
								form.getAttribute("action") ||
								this.form.getAttribute("action");
							enctype =
								target.getAttribute("formenctype") ||
								form.getAttribute("enctype") ||
								this.form.enctype;
							formData = new FormData(form);

							// Include name + value from a <button>
							if (target.name) {
								formData.append(target.name, target.value);
							}
						} else if (isHtmlElement(target)) {
							throw new Error(
								"Cannot submit element that is not <form>, <button>, or " +
									'<input type="submit|image">'
							);
						}

						if (!action) {
							action = window.location.pathname;
						}

						let { protocol, host } = window.location;
						let url = new URL(action, protocol + "//" + host);

						if (method == "GET") {
							// Start with a fresh set of params and wipe out the old params to
							// match default browser behavior
							let params = new URLSearchParams();
							let hasParams = false;
							for (let [name, value] of formData) {
								if (typeof value === "string") {
									hasParams = true;
									params.append(name, value);
								} else {
									throw new Error("Cannot submit binary form data using GET");
								}
							}

							url.search = hasParams ? "?" + params.toString() : "";
						}

						let body;
						let headers = {};
						if (method != "GET") {
							body = formData;

							if (enctype === "application/x-www-form-urlencoded") {
								body = new URLSearchParams();
								for (let [key, value] of formData) {
									body.append(key, value);
								}
								headers = { "Content-Type": enctype };
							}
						}

						window._transitions.forEach((c) => c.abort());
						window._transitions = [];

						let controller = new AbortController();
						let signal = controller.signal;
						let transition = { method, url, formData, controller };
						window._transitions.push(transition);
						emitChange();

						if (!replace) {
							return;
						}

						fetch(url.href, {
							method,
							headers,
							body,
							signal,
						})
							.then(async (response) => {
								if (signal.aborted) return;

								history.replaceState({}, "", url.href);
								document.documentElement.innerHTML = await response.text();
								executeScriptElements(document.getElementsByTagName("body")[0]);
							})
							.catch((reason) => {
								console.error(reason);
							})
							.then(() => {
								if (signal.aborted) return;
								window._transitions = [];
								emitChange();
							});

						event.preventDefault();
					});
				}
			}

			function executeScriptElements(containerElement) {
				const scriptElements = containerElement.querySelectorAll("script");

				Array.from(scriptElements).forEach((scriptElement) => {
					const clonedElement = document.createElement("script");

					Array.from(scriptElement.attributes).forEach((attribute) => {
						clonedElement.setAttribute(attribute.name, attribute.value);
					});

					clonedElement.text = scriptElement.text;

					scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
				});
			}

			function isHtmlElement(obj) {
				return obj != null && typeof obj.tagName === "string";
			}

			function isButtonElement(obj) {
				return isHtmlElement(obj) && obj.tagName.toLowerCase() === "button";
			}

			function isFormElement(obj) {
				return isHtmlElement(obj) && obj.tagName.toLowerCase() === "form";
			}

			function isInputElement(obj) {
				return isHtmlElement(obj) && obj.tagName.toLowerCase() === "input";
			}

			if (!customElements.get("remix-form")) {
				customElements.define("remix-form", RemixFormElement);
			}
		</script>
	`;
}
