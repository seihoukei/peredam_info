<script>
    import UserMain from "components/user/UserMain.svelte"
    import LoginSequence from "components/login-sequence/LoginSequence.svelte"
    import AnonymousMain from "components/anonymous/AnonymousMain.svelte"
    import ModalDialog from "components/common/ModalDialog.svelte"
    import KnowledgeBase from "components/knowledge/KnowledgeBase.svelte"
    import Welcome from "components/welcome/Welcome.svelte"

    import {onMount} from "svelte"

    import {libraryReady, loadLibrary} from "stores/library.js"
    import appState from "stores/app-state.js"

    import Api from "utility/api.js"
    import modal from "stores/modal.js"

    let attempt = 0
    let user = {
        systems: []
    }

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

    async function loadUser() {
        if (!$libraryReady) {
            await loadLibrary
        }

        appState.restorePageData(page)

        user = {systems: []}

        const result = await Api.getUserSystems(token)

        if (result.success) {
            user.systems = result.data

        } else if (token !== "") {
            modal.error(result.error, [{
                text: "Повторить попытку",
                callback : retry,
            }])
        }

        return result
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
            <UserMain bind:user/>

        {:else}
            <Welcome />

        {/if}

    {/await}

{/if}

<KnowledgeBase/>
<ModalDialog/>
