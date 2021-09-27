<script context="module">
    export async function load({ session }) {
        return {
            props: {
                userName: session.userName,
            },
        };
    }
</script>

<script>
    import { session } from "$app/stores";
    import { APP_URL, AUTH0_DOMAIN } from "$internal/envVars";

    export let userName;

    const auth0LogoutURL = `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${APP_URL}`;

    async function logout() {
        const res = await fetch("auth/logout", {
            method: "POST",
        });
        if (res.status !== 200) {
            return;
        }
        $session.userName = null;
    }
</script>

<h1>Welcome to SvelteKit{userName ? `, ${userName}!` : "!"}</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

{#if userName}
    <button on:click={logout}>Logout of app</button> or
    <a href={auth0LogoutURL}>
        <button on:click={logout}>Logout of SSO session</button>
    </a>
{:else}
    <a href="/auth/login">
        <button>Login</button>
    </a>
{/if}
