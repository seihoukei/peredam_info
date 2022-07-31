<script>
    import TopLogo from "../common/TopLogo.svelte"
    import LoginStage from "./stages/LoginStage.svelte"
    import PasswordStage from "./stages/PasswordStage.svelte"
    import CodeStage from "./stages/CodeStage.svelte"

    import Tokens from "../../utility/tokens.js"
    import {onMount} from "svelte"
    import appState from "../../stores/app-state.js"

    let state = {
        stage: "",
        login: localStorage.login ?? "",
        isNewUser: false,
        tokens: Tokens.retrieve(),
        user_provider_id: localStorage.user_provider_id ?? "",
    }

    //decoupling updates from storages
    $: page = $appState.page
    $: isAnonymousPage = $appState.isAnonymousPage
    $: token = $appState.token

    $: user_provider_id = state.user_provider_id
    $: stage = state.stage
    $: tokens = state.tokens

    $: Tokens.store(tokens)

    $: if (stage === "complete") {
        finalize()
    }

    onMount(() => {
        if (tokens.current !== "") {
            state.stage = "complete"
        } else if (tokens.encrypted !== "") {
            state.stage = "code"
        } else if (state.login !== "") {
            state.stage = "password"
        } else {
            state.stage = "login"
        }
    })

    function finalize() {
        localStorage.login = state.login
        appState.setUserProviderId(user_provider_id)
        appState.setValue("username", state.login, appState.UPDATE_ADDRESS.NO)
        appState.setToken(tokens.current)

        if (user_provider_id && page !== "read") {
            appState.setPage("read")
        }

        if (!user_provider_id && page === "read") {
            appState.setPage("user")
        }

    }

</script>

{#if !isAnonymousPage && token === ""}
    {#if import.meta.env.MODE === "development"}
        <pre class="bottom debug">{JSON.stringify(state, null, 1)}</pre>
    {/if}

    <div class="top-central">
        <TopLogo/>
    </div>

    {#if stage === "login"}
        <LoginStage bind:state/>

    {:else if stage === "password"}
        <PasswordStage bind:state/>

    {:else if stage === "code"}
        <CodeStage bind:state/>

    {/if}
{/if}
