<script>
    import UserMain from "components/user/UserMain.svelte"
    import LoginSequence from "components/login-sequence/LoginSequence.svelte"
    import AnonymousMain from "components/anonymous/AnonymousMain.svelte"
    import ModalDialog from "components/common/ModalDialog.svelte"
    import KnowledgeBase from "components/knowledge/KnowledgeBase.svelte"
    import Welcome from "components/welcome/Welcome.svelte"
    import Error from "components/login-sequence/elements/Error.svelte"

    import {onMount} from "svelte"

    import {libraryReady, loadLibrary} from "stores/library.js"
    import appState from "stores/app-state.js"

    import Api from "utility/api.js"

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
        if (!$libraryReady) {
            await loadLibrary
        }

        appState.restorePageData(page)

        return await Api.getUserSystems(token)
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">{JSON.stringify($appState, null, 1)}</pre>
{/if}

{#if !isAnonymousPage && token === ""}
    <LoginSequence/>

{:else}
    {#await loading}
        <Welcome/>

    {:then result}
        {#if isAnonymousPage}
            {#if page === 'anon'}
                <AnonymousMain/>

            {:else if page === 'info'}
                info stub

            {/if}

        {:else if result?.success}
            <UserMain user={{systems:result.data}}/>

        {:else}
            <Error message={result?.error ?? "Ошибка связи"} on:click={retry}/>

        {/if}

    {/await}

{/if}

<KnowledgeBase/>
<ModalDialog/>
