<script>
    import UserMain from "./forms/user/UserMain.svelte"
    import LoginSequence from "./forms/login-sequence/LoginSequence.svelte"
    import AnonymousMain from "./forms/anonymous/AnonymousMain.svelte"
    import ModalDialog from "./forms/common/ModalDialog.svelte"
    import KnowledgeBase from "./forms/knowledge/KnowledgeBase.svelte"
    import Welcome from "./forms/welcome/Welcome.svelte"
    import Error from "./forms/login-sequence/elements/Error.svelte"

    import Api from "./utility/api.js"
    import {libraryReady, loadLibrary} from "./stores/library.js"
    import appState from "./stores/app-state.js"
    import {onMount} from "svelte"

    let attempt = 0

    $: token = $appState.token
    $: page = $appState.page
    $: isAnonymousPage = $appState.isAnonymousPage

    $: loading = loadUser(token, attempt)

    onMount(() => {
        appState.restorePage()
    })

    function retry() {
        attempt++
    }

    async function loadUser(token) {
        if (!$libraryReady)
            await loadLibrary

        appState.restorePageData(page)

        return await Api.getUserSystems(token)
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">{JSON.stringify($appState, null, 1)}</pre>
{/if}

{#if !isAnonymousPage && token === ""}
    <LoginSequence />

{:else}
    {#await loading}
        <Welcome />

    {:then result}
        {#if isAnonymousPage}
            {#if page === 'anon'}
                <AnonymousMain />

            {:else if page === 'info'}
                info stub

            {/if}

        {:else if result?.success}
            <UserMain user={{systems:result.data}} />

        {:else}
            <Error message={result?.error ?? "Ошибка связи"} on:click={retry} />

        {/if}

    {/await}

{/if}

<KnowledgeBase />
<ModalDialog />
