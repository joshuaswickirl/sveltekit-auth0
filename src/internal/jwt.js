import jsrsasign from "jsrsasign";
import { Buffer } from "buffer";


export function verifyNonce(jwt, nonce) {
    const jwtPayloadB64Encoded = jwt.split(".")[1]
    const jwtPayload = Buffer.from(jwtPayloadB64Encoded, "base64").toString()
    if (jsrsasign.KJUR.jws.JWS.isSafeJSONString(jwtPayload) === 0) {
        console.log("jwt payload is not valid json string")
        return false
    }
    const jwtObject = jsrsasign.KJUR.jws.JWS.readSafeJSONString(jwtPayload)

    // generate hash of nonce
    const nonceHash = nonce

    return jwtObject.nonce === nonceHash
}

export async function verifyJWT(jwt, auth0Domain, clientID, currentKeyID) {
    const jwk = await loadJWK(auth0Domain, currentKeyID);
    const pubkey = jsrsasign.KEYUTIL.getKey({ kty: jwk.kty, n: jwk.n, e: jwk.e })

    return jsrsasign.KJUR.jws.JWS.verifyJWT(jwt, pubkey, {
        alg: [jwk.alg],
        aud: [clientID],
        iss: `https://${auth0Domain}/`
    })
}

async function loadJWK(auth0Domain, keyID) {
    const body = await fetch(`https://${auth0Domain}/.well-known/jwks.json`).then(r => r.json())
    return body.keys.find(o => o.kid == keyID)
}
