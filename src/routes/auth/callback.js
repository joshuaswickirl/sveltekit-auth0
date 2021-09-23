import { getEnvVars } from "$internal/envVars";
import cache from "$internal/cache";

const envVars = getEnvVars();

export async function get(request) {
    const state = request.query.get("state")
    // compare state param to OIDC state store in local memory

    const callbackCode = request.query.get("code");
    const tokens = await requestTokens(callbackCode);

    // validate id_token https://auth0.com/docs/security/tokens/id-tokens/validate-id-tokens
    // validate access_token https://auth0.com/docs/security/tokens/access-tokens/validate-access-tokens

    const userInfo = await getUserInfo(tokens.access_token)

    cache.writeSession(tokens.id_token, { info: userInfo, tokens: tokens })

    return {
        status: 302,
        headers: {
            location: "/",
            "set-cookie": `jwt=${tokens.id_token}; path=/; HttpOnly`
        },
    };
}

async function requestTokens(callbackCode) {
    return fetch(`https://${envVars.AUTH0_DOMAIN}/oauth/token`, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            "grant_type": "authorization_code",
            "client_id": envVars.AUTH0_CLIENT_ID,
            "client_secret": envVars.AUTH0_CLIENT_SECRET,
            "code": callbackCode,
            "redirect_uri": "http://localhost:3000/auth/callback"
        })
    }).then(response => response.json())
}

function getUserInfo(accessToken) {
    return fetch(`https://${envVars.AUTH0_DOMAIN}/userinfo`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((r) => r.json());
}
