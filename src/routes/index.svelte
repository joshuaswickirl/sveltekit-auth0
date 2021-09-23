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

    export let userName;

    async function logout() {
        const res = await fetch("auth/logout", {
            method: "POST",
        });
        console.log(res.status);
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
    <button on:click={logout}>Logout of app</button>
{:else}
    <a href="/auth/login">
        <button>Login</button>
    </a>
{/if}
