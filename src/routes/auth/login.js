import { getEnvVars } from "$internal/envVars";

const envVars = getEnvVars();

export async function get() {
    const domain = envVars.AUTH0_DOMAIN
    const clientID = envVars.AUTH0_CLIENT_ID
    const redirectURI = `${envVars.APP_URL}/auth/callback`
    const responseType = "code"
    const state = "12345"
    const nonce = "54321"
    const scope = "openid offline_access profile email"

    const url = `https://${domain}/authorize?response_type=${responseType}&\
client_id=${clientID}&redirect_uri=${redirectURI}&state=${state}&\
nonce=${nonce}&scope=${scope}`

    return {
        status: 302,
        headers: {
            location: url,
        },
    }
}
