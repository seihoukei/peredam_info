<script>
    import UserMain from "./forms/user/UserMain.svelte"
    import LoginSequence from "./forms/login-sequence/LoginSequence.svelte"
    import AnonymousMain from "./forms/anonymous/AnonymousMain.svelte"
    import ProviderMain from "./forms/provider/ProviderMain.svelte"
    import StatusReporter from "./forms/common/StatusReporter.svelte"
    import KnowledgeBase from "./forms/knowledge/KnowledgeBase.svelte"

    import Welcome from "./forms/welcome/Welcome.svelte"
    import Error from "./forms/login-sequence/elements/Error.svelte"

    import Api from "./utility/api.js"
    import {loadLibrary} from "./stores/library.js"
    import token from "./stores/token.js"
    import Address from "./utility/address.js"

    let username = localStorage.login ?? ""
    let anonymous = Address.getPart(0) === "anon"
    let provider_id = localStorage.provider_id ?? null
    let attempt = 0

    $: loading = loadUser($token, attempt)

    async function loadUser(token) {
        await loadLibrary
        return await Api.getUserSystems(token)
    }

    function retry() {
        attempt++
    }
</script>

<div class="app-container">
    {#if anonymous}
        {#await loading}
            <Welcome />
        {:then result}
            <AnonymousMain bind:anonymous/>
        {/await}
    {:else if $token === ""}
        <LoginSequence bind:username bind:anonymous bind:provider_id/>
    {:else}
        {#await loading}
            <Welcome />
        {:then result}
            {#if result?.success}
                {#if provider_id}
                    <ProviderMain {provider_id} />
                {:else}
                    <UserMain {username} user={{systems:result.data}}/>
                {/if}
            {:else}
                <Error message={result?.error ?? "Ошибка связи"} on:click={retry} />
            {/if}
        {/await}
    {/if}
</div>

<StatusReporter />
<KnowledgeBase />
<style>
    div.app-container {
        position: relative;
        display : flex;
        width : 100vw;
        height : 100vh;
        overflow: auto;
    }
</style>
