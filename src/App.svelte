<script>
    import UserMain from "./forms/user/UserMain.svelte"
    import LoginSequence from "./forms/login-sequence/LoginSequence.svelte"
    import Api from "./utility/api.js"
    import {loadLibrary} from "./stores/library.js"
    import Welcome from "./forms/Welcome.svelte"
    import token from "./stores/token.js"
    import Error from "./forms/login-sequence/elements/Error.svelte"

    let username = localStorage.login ?? ""

    $: loading = loadLibrary
        .then(async () => await Api.getUserData(token))

</script>

{#if $token === ""}
    <LoginSequence bind:username/>
{:else}
    {#await loading}
        <Welcome />
    {:then result}
        {#if result?.success}
            <UserMain {username} user={result.data}/>
        {:else}
            <Error message={result?.error ?? "Ошибка связи"} />
        {/if}
    {/await}
{/if}
