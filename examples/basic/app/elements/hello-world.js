import { useElementName } from "enhance-remix";

const defaultGreeting = "Hello World!";
/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function HelloWorld({ html, state }) {
  let elementName = useElementName(HelloWorld);

  let { attrs } = state;
  let { greeting = defaultGreeting } = attrs;
  return html`
    <p>${greeting}</p>

    <style>
      hello-world {
        color: red;
      }
    </style>

    <script type="module">
      const defaultGreeting = ${JSON.stringify(defaultGreeting)};

      class HelloWorldElement extends HTMLElement {
        constructor() {
          super();
          this.greeting = this.querySelector("p");
        }

        static get observedAttributes() {
          return ["greeting"];
        }

        attributeChangedCallback(name, oldValue, newValue) {
          if (oldValue !== newValue) {
            if (name === "greeting") {
              this.greeting.textContent = newValue || defaultGreeting;
            }
          }
        }
      }

      customElements.define(${JSON.stringify(elementName)}, HelloWorldElement);
    </script>
  `;
}
