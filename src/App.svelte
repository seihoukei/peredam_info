<script>
    import UserMain from "components/user/UserMain.svelte"
    import LoginSequence from "components/login-sequence/LoginSequence.svelte"
    import AnonymousMain from "components/anon/AnonymousMain.svelte"
    import ModalDialog from "components/common/ModalDialog.svelte"
    import KnowledgeBase from "components/knowledge/KnowledgeBase.svelte"
    import Welcome from "components/welcome/Welcome.svelte"

    import {fade, fly} from "svelte/transition"
    import {onMount} from "svelte"

    import {libraryReady, loadLibrary} from "stores/library.js"
    import appState from "stores/app-state.js"

    import Api from "utility/api.js"
    import Transitions from "utility/transitions.js"
    import StatusDisplay from "components/common/StatusDisplay.svelte"
    import modal from "stores/modal.js"
    import apiStatus from "stores/api-status.js"
    import Messages from "utility/messages.js"

    let attempt = 0
    let user = {
        systems: []
    }

    $: token = $appState.token
    $: page = $appState.page
    $: isAnonymousPage = $appState.isAnonymousPage

    onMount(() => {
        appState.restorePage()
    })

    function retry() {
        attempt++
    }

    function offlineMode() {
        try {
            user = {
                systems : JSON.parse(atob(localStorage.offlineSystems)),
                offline : true,
            }
        } catch (e) {
            modal.error("Автономный режим недоступен")
        }
        retry()
    }

    async function loadUser() {
        if (!$libraryReady) {
            await loadLibrary
        }

        appState.restorePageData(page)

        if (user.offline) {
            return Messages.success(user)
        }

        user = {
            systems: [],
            properties : {},
        }

        if (token === "")
            return

        const result = await await apiStatus.await(
            Api.getUserData(token),
            "Загрузка данных пользователя"
        )

        if (result.success) {
            user = result.data
            appState.setValue("display_name", result.data.properties.user.display_name, appState.UPDATE_ADDRESS.NO)

        } else if (token !== "") {
            if (localStorage.offlineSystems) {
                modal.error(result.error, [{
                    text: "Повторить попытку",
                    callback : retry,
                    back : true,
                },{
                    text: "Автономная работа",
                    callback : offlineMode,
                    back : true,
                }])
            } else {
                modal.error(result.error, [{
                    text: "Повторить попытку",
                    callback : retry,
                    back : true,
                }])
            }
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
    {#await loadUser(token, attempt)}
        <div in:fade out:fade>
            <Welcome />
        </div>

    {:then result}
        {#if isAnonymousPage}
            {#if page === 'anon'}
                <div in:fade out:fly={Transitions.dialogFlyUp}>
                    <AnonymousMain offline={user.offline}/>
                </div>

            {:else if page === 'info'}
                info stub

            {/if}

        {:else if result?.success}
            <div in:fade out:fly={Transitions.dialogFlyUp}>
                <UserMain bind:user/>
            </div>

        {:else}
            <div in:fade out:fade>
                <Welcome />
            </div>

        {/if}

    {/await}

{/if}

<KnowledgeBase/>
<ModalDialog/>
<StatusDisplay/>
