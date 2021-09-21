import cookie from "cookie";

export async function handle({ request, resolve }) {
    const cookies = cookie.parse(request.headers.cookie || "");
    // validate jwt
    request.locals.user = cookies.jwt;

    return await resolve(request);
}
