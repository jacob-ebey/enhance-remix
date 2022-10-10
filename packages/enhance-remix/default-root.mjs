/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function DefaultRoot({ html }) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Enhance Remix</title>
      </head>
      <body>
        <h1>Enhance Remix</h1>
        <p>
          <a href="/about">About</a>
        </p>
        <slot></slot>
      </body>
    </html>
  `;
}
