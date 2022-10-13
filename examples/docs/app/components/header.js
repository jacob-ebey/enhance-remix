export default function Header({ pathname }) {
	return /*html*/ `
		<header class="header">
			<h1>Enhance Remix</h1>
			<p>A useable site as the baseline.</p>
			<nav>
				<ul>
					<li>
						<a href="/" ${pathname == "/" ? 'aria-current="page"' : ""}>Home</a>
					</li>
					<li>
						<a href="/docs" ${
							pathname.startsWith("/docs") ? 'aria-current="page"' : ""
						}>Docs</a
						>
					</li>
					<li>
						<a href="/kitchen-sink" ${
							pathname.startsWith("/kitchen-sink") ? 'aria-current="page"' : ""
						}>Kitchen Sink</a>
					</li>
				</ul>
			</nav>
		</header>

		<style>
			.header h1 {
				margin: 0;
				font-size: 1.5em;
			}
			.header p {
				margin: 0;
				font-size: 0.85em;
			}
		</style>
	`;
}
