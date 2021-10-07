import { getEnvVars } from "$internal/envVars";
import { verifyNonce, verifyJWT } from "$internal/jwt";
import cache from "$internal/cache";
import cookie from "cookie"

const envVars = getEnvVars();

export async function get(request) {
    const auth0StateCookieName = envVars.AUTH0_STATE_COOKIE_NAME
    const auth0NonceCookieName = envVars.AUTH0_NONCE_COOKIE_NAME

    const state = request.query.get("state")
    const cookies = cookie.parse(request.headers.cookie)
    if (state !== cookies[auth0StateCookieName]) {
        console.log("state doesnt match", state, cookies[auth0StateCookieName])
        return {
            status: 401,
            headers: {
                location: "/",
                'set-cookie': [deleteCookie(auth0StateCookieName), deleteCookie(auth0NonceCookieName)]
            }
        }
    }

    const callbackCode = request.query.get("code");
    const tokens = await requestTokens(callbackCode);

    const nonceOk = verifyNonce(tokens.id_token, cookies[auth0NonceCookieName])
    if (!nonceOk) {
        console.log("Nonce failed verification.")
        return {
            status: 401,
            headers: {
                location: "/",
                'set-cookie': [deleteCookie(auth0StateCookieName), deleteCookie(auth0NonceCookieName)]
            }
        }
    }

    const jwtIsValid = await verifyJWT(tokens.id_token, envVars.AUTH0_DOMAIN, envVars.AUTH0_CLIENT_ID, envVars.AUTH0_CURRENT_KEYID)
    if (!jwtIsValid) {
        console.log("ID token failed verification.")
        return {
            status: 401,
            headers: {
                location: "/",
                'set-cookie': [deleteCookie(auth0StateCookieName), deleteCookie(auth0NonceCookieName)]
            }
        }
    }

    const userInfo = await getUserInfo(tokens.access_token)

    cache.writeSession(tokens.id_token, { info: userInfo, tokens: tokens })

    return {
        status: 302,
        headers: {
            location: "/",
            "set-cookie": [
                `jwt=${tokens.id_token}; path=/; HttpOnly`,
                deleteCookie(auth0StateCookieName),
                deleteCookie(auth0NonceCookieName)
            ],
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

function deleteCookie(cookieName) {
    return `${cookieName}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
