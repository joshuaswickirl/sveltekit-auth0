// This is needed until https://github.com/vitejs/vite/issues/3176 is resolved.
// See https://kit.svelte.dev/faq#env-vars.
import("dotenv").then((dotenv) => {
    dotenv.config();
});

export function getEnvVars() {
    return {
        AUTH0_DOMAIN: process.env["AUTH0_DOMAIN"],
        AUTH0_CLIENT_ID: process.env["AUTH0_CLIENT_ID"],
        AUTH0_CLIENT_SECRET: process.env["AUTH0_CLIENT_SECRET"],
    };
}
