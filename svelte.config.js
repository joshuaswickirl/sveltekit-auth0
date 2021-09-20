/** @type {import('@sveltejs/kit').Config} */

import node from "@sveltejs/adapter-node";
import path from "path";

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node(),
		vite: {
			resolve: {
				alias: {
					$internal: path.resolve("./src/internal")
				}
			}
		}
	}
};

export default config;
