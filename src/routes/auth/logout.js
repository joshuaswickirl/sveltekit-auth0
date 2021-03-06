import cache from "$internal/cache";

export async function post(request) {
    cache.delSession(request.locals.user)
    return {
        headers: {
            'set-cookie': 'jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        },
        body: {
            ok: true
        }
    };
}
