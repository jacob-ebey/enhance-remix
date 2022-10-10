import { json } from "enhance-remix";

/**
 *
 * @param {LoaderFunctionArgs} args
 */
export function loader({ request }) {
  let url = new URL(request.url);
  let greeting = url.searchParams.get("greeting") || undefined;
  if (greeting) {
    greeting = greeting.trim() || undefined;
  }

  return json({ greeting });
}

/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function Index({ html, state }) {
  let { greeting } = state.store.loaderData["routes/index"];

  return html`
    <head>
      <title>Enhance Remix</title>
    </head>
    <h2>Home!!!</h2>
    <hello-world ${greeting ? `greeting=${greeting}` : ""}></hello-world>
    <form>
      <input type="text" name="greeting" value=${greeting} />
    </form>

    <script type="module">
      class IndexRouteElement extends HTMLElement {
        constructor() {
          super();
          this.form = this.querySelector("form");
          this.greeting = this.querySelector("input[name='greeting']");
          this.helloWorld = this.querySelector("hello-world");

          const commitGreeting = () => {
            let greeting = this.greeting.value.trim();
            this.helloWorld.setAttribute("greeting", greeting);
            let url = new URL(window.location.href);
            if (greeting) {
              url.searchParams.set("greeting", greeting);
            } else {
              url.searchParams.delete("greeting");
            }

            history.replaceState({}, "", url.href);
          };

          this.form.addEventListener("submit", (event) => {
            commitGreeting();
            event.preventDefault();
          });

          this.greeting.addEventListener("input", () => {
            this.helloWorld.setAttribute("greeting", this.greeting.value);
          });
          this.greeting.addEventListener("focusout", commitGreeting);
        }
      }

      customElements.define("route-routes-index", IndexRouteElement);
    </script>
  `;
}
