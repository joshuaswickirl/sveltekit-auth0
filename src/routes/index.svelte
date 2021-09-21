<script>
    async function logout() {
        const res = await fetch("auth/logout", {
            method: "POST",
        });
        console.log(res.status);
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<a href="/auth/login">
    <button>Login</button>
</a>

<button on:click={logout}>Logout</button>
