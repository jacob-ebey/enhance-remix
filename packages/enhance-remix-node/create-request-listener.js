/**
 * @param {import("enhance-remix/enhance-remix").RequestHandler} handler
 * @returns {import("http").RequestListener}
 */
export default function createRequestListener(handler) {
	/**
	 * @param {import("http").IncomingMessage} req
	 * @param {import("http").ServerResponse} res
	 */
	return async (req, res) => {
		try {
			let url = new URL(req.url, "http://localhost");
			let body = req.method != "GET" && req.method != "HEAD" ? req : undefined;
			let request = new Request(url, {
				method: req.method,
				headers: req.headers,
				body,
			});
			let response = await handler(request);
			let headers = {};
			for (let [key, value] of response.headers) {
				if (!(key in headers)) {
					headers[key] = value;
				} else {
					if (Array.isArray(headers[key])) {
						headers[key].push(value);
					} else {
						headers[key] = [headers[key], value];
					}
				}
			}
			res.writeHead(response.status, response.statusText, headers);

			if (response.body) {
				let reader = response.body.getReader();
				for (
					let block = await reader.read();
					!block.done;
					block = await reader.read()
				) {
					res.write(block.value);
				}
				res.end();
			} else {
				res.end();
			}
		} catch (reason) {
			console.error(reason);
			res.writeHead(500, "Internal Server Error");
			res.end();
		}
	};
}
