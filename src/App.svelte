<script>
    import UserMain from "./forms/user/UserMain.svelte"
    import LoginSequence from "./forms/login-sequence/LoginSequence.svelte"
    import AnonymousMain from "./forms/anonymous/AnonymousMain.svelte"
    import StatusReporter from "./forms/common/StatusReporter.svelte"
    import KnowledgeBase from "./forms/knowledge/KnowledgeBase.svelte"

    import Welcome from "./forms/welcome/Welcome.svelte"
    import Error from "./forms/login-sequence/elements/Error.svelte"

    import Api from "./utility/api.js"
    import {loadLibrary} from "./stores/library.js"
    import appState from "./stores/app-state.js"
    import {onMount} from "svelte"

    let attempt = 0

    $: token = $appState.token
    $: loading = loadUser(token, attempt)

    async function loadUser() {
        await loadLibrary
        appState.restorePageData($appState.page)
        return await Api.getUserSystems(token)
    }

    function retry() {
        attempt++
    }

    onMount(() => {
        appState.restorePage()
    })
</script>
{#if import.meta.env.MODE === "development"}
    <pre class="debug">{JSON.stringify($appState, null, 1)}</pre>
{/if}

{#if $appState.page === 'anon'}
    {#await loading}
        <Welcome />

    {:then result}
        <AnonymousMain />

    {/await}

{:else if token === ""}
    <LoginSequence />

{:else}
    {#await loading}
        <Welcome />

    {:then result}
        {#if result?.success}
            <UserMain user={{systems:result.data}} />

        {:else}
            <Error message={result?.error ?? "Ошибка связи"} on:click={retry} />

        {/if}

    {/await}

{/if}

<StatusReporter />
<KnowledgeBase />
