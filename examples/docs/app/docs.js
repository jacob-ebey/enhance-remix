import * as fs from "fs";
import * as path from "path";

import fm from "front-matter";
import { marked } from "marked";
import hljs from "highlight.js";

export function loadDocument(pathname) {
	let filename;
	if (pathname == "/") {
		filename = "README.md";
	} else if (pathname == "/docs") {
		filename = "docs/README.md";
	} else {
		filename = path.join(pathname.replace(/^\//, "") + ".md");
	}
	filename = path.resolve(process.cwd(), "../../", filename);

	if (!fs.existsSync(filename)) {
		return null;
	}

	let content = fs.readFileSync(filename, "utf8");

	let { attributes, body } = fm(content);

	let html = marked(body, {
		highlight: (code, lang) => {
			let language = hljs.getLanguage(lang) ? lang : "plaintext";
			return hljs.highlight(code, { language }).value;
		},
		langPrefix: "hljs language-",
	});

	return { attributes, html };
}
