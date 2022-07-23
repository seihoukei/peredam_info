<script>
    import Main from "./forms/Main.svelte"
    import LoginSequence from "./forms/LoginSequence.svelte"

    let token = ""
    let username = localStorage.login

</script>

{#if token === ""}
    <LoginSequence bind:token bind:login={username}/>
{:else}
    <Main bind:token {username}/>
{/if}

<style>

</style>
