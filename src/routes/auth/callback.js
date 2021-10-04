import { getEnvVars } from "$internal/envVars";
import { validate } from "$internal/jwt";
import cache from "$internal/cache";

const envVars = getEnvVars();

export async function get(request) {
    const state = request.query.get("state")
    // compare state param to OIDC state store in local memory

    const callbackCode = request.query.get("code");
    const tokens = await requestTokens(callbackCode);

    const nonce = "54321"
    const nonceOk = verifyNonce(tokens.id_token, nonce)
    if (!nonceOk) {
        console.log("Nonce failed verification.")
        return {
            status: 401,
            headers: {
                location: "/"
            }
        }
    }

    const jwtIsValid = await verifyJWT(tokens.id_token, envVars.AUTH0_DOMAIN, envVars.AUTH0_CLIENT_ID, envVars.AUTH0_CURRENT_KEYID)
    if (!jwtIsValid) {
        console.log("ID token failed verification.")
        return {
            status: 401,
            headers: {
                location: "/"
            }
        }
    }

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
