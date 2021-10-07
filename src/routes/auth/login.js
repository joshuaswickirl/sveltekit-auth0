import { getEnvVars } from "$internal/envVars";

const envVars = getEnvVars();

export async function get() {
    const domain = envVars.AUTH0_DOMAIN
    const clientID = envVars.AUTH0_CLIENT_ID
    const redirectURI = `${envVars.APP_URL}/auth/callback`
    const responseType = "code"
    const state = generateRandomString()
    const nonce = generateRandomString()
    const scope = "openid offline_access profile email"

    // generate hash of nonce
    const nonceHash = nonce

    const url = `https://${domain}/authorize?response_type=${responseType}&\
client_id=${clientID}&redirect_uri=${redirectURI}&state=${state}&\
nonce=${nonceHash}&scope=${scope}`

    const auth0StateCookieName = envVars.AUTH0_STATE_COOKIE_NAME
    const auth0NonceCookieName = envVars.AUTH0_NONCE_COOKIE_NAME
    return {
        status: 302,
        headers: {
            location: url,
            "set-cookie": [
                `${auth0StateCookieName}=${state}; path=/; HttpOnly`,
                `${auth0NonceCookieName}=${nonce}; path=/; HttpOnly`
            ]
        },
    }
}

function generateRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
