/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function DefaultRoot({ html }) {
  return html` <slot></slot> `;
}
