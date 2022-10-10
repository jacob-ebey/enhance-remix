/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function A({ html }) {
  return html`
    <h2>A</h2>
    <slot></slot>
  `;
}
