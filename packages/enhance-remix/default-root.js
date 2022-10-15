/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export function DefaultRoot({ html }) {
	return html` <slot></slot> `;
}
