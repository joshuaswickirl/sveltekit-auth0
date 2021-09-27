import { getEnvVars } from "$internal/envVars";
import auth0 from "auth0-js";

const envVars = getEnvVars();

export async function get() {
    const webAuth = new auth0.WebAuth({
        domain: envVars.AUTH0_DOMAIN,
        clientID: envVars.AUTH0_CLIENT_ID,
        redirectUri: `${envVars.APP_URL}/auth/callback`,
        responseType: "code", //https://auth0.com/docs/login/authentication/add-login-auth-code-flow
    });

    const url = webAuth.client.buildAuthorizeUrl({
        state: "12345",
        nonce: "54321",
        scope: "openid offline_access profile email",
    })

    return {
        status: 302,
        headers: {
            location: url,
        },
    };
}