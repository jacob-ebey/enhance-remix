/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function Root({ html }) {
  return html`
    <h1>Enhance Remix</h1>
    <p>
      <a href="/">Home</a>
      <a href="/a">A</a>
      <a href="/a/1">A.1</a>
    </p>
    <slot></slot>
  `;
}
