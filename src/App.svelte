<script>
    import Main from "./forms/Main.svelte"
    import Login from "./forms/Login.svelte"
    import tokens, {loggedIn, userToken} from "./stores/tokens.js"

    $: document.body.classList.toggle("login", !$loggedIn)
</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">{JSON.stringify($tokens,null,1)}</pre>
{/if}

{#if $loggedIn}
    <Main token={$userToken}/>
{:else}
    <Login />
{/if}

<style>
   .debug {
       color: var(--text-color);
       position: absolute;
       opacity: 0.2;
       font-size: 20px;
       pointer-events: none;
       z-index:100;
   }
</style>
