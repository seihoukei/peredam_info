<script>
    import UserMain from "./forms/user/UserMain.svelte"
    import LoginSequence from "./forms/login-sequence/LoginSequence.svelte"
    import Api from "./utility/api.js"
    import {loadLibrary} from "./stores/library.js"
    import Welcome from "./forms/welcome/Welcome.svelte"
    import token from "./stores/token.js"
    import Error from "./forms/login-sequence/elements/Error.svelte"
    import AnonymousMain from "./forms/anonymous/AnonymousMain.svelte"
    import ProviderMain from "./forms/provider/ProviderMain.svelte"
    import StatusReporter from "./forms/common/StatusReporter.svelte"
    import KnowledgeBase from "./forms/knowledge/KnowledgeBase.svelte"

    let username = localStorage.login ?? ""
    let anonymous = false
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

{#if anonymous}
    <AnonymousMain bind:anonymous/>
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

<StatusReporter />
<KnowledgeBase />
