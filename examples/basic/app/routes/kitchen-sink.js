import { useLocation } from "enhance-remix";

/**
 * @arg {import("enhance-remix").MetaFunctionArgs<typeof loader>} args
 */
export function meta() {
	return {
		lang: "en-us",
		title: "KitchenSink | Enhance Remix",
		description: "A useable site as the baseline.",
	};
}

/**
 * @type {import("@enhance/types").EnhanceElemFn}
 */
export default function Docs({ html, state }) {
	let location = useLocation(state);

	return html`
		<main>
			<nav>
				<ul>
					<li><a href="/kitchen-sink/form-get">GET Form</a></li>
					<li><a href="/kitchen-sink/form-get-replace">GET Form replace</a></li>
					<li><a href="/kitchen-sink/form-post">POST Form</a></li>
					<li>
						<a href="/kitchen-sink/form-post-replace">POST Form replace</a>
					</li>
				</ul>
			</nav>
			${location.pathname == "/kitchen-sink"
				? /*html*/ `
          <article>
            <h1>Kitchen Sink</h1>
            <p>Examples of all the features of Enhance Remix.</p>

            <br />

            <ul>
              <li>
                <a href="/kitchen-sink/form-get">GET Form</a>
              </li>
              <li><a href="/kitchen-sink/form-get-replace">GET Form replace</a></li>
              <li><a href="/kitchen-sink/form-post">POST Form</a></li>
              <li>
                <a href="/kitchen-sink/form-post-replace">POST Form replace</a>
              </li>
            </ul>
          </article>`
				: "<slot></slot>"}
		</main>
	`;
}
