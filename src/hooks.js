import cookie from "cookie";
import cache from "$internal/cache";

export async function handle({ request, resolve }) {
    const cookies = cookie.parse(request.headers.cookie || "");
    // validate jwt
    request.locals.user = cookies.jwt;

    return await resolve(request);
}

// getSession return info that is accessible to the client.
export async function getSession(request) {
    const session = cache.getSession(request.locals.user)
    console.log("session from cache", session)

    if (session === undefined) {
        return {
            user: null
        }
    }

    return {
        userName: session.info.name
    }
}
