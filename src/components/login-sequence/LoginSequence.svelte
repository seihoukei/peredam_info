<script>
    import TopLogo from "components/common/TopLogo.svelte"
    import LoginStage from "components/login-sequence/stages/LoginStage.svelte"
    import PasswordStage from "components/login-sequence/stages/PasswordStage.svelte"
    import CodeStage from "components/login-sequence/stages/CodeStage.svelte"

    import {onMount} from "svelte"

    import appState from "stores/app-state.js"

    import Tokens from "utility/tokens.js"
    import SelectLoginTypeStage from "components/login-sequence/stages/SelectLoginTypeStage.svelte"

    Tokens.checkAuthVer()

    let state = {
        stage: "",
        login: localStorage.login ?? "",
        isNewUser: false,
        tokens: Tokens.retrieve(),
        user_provider_id: localStorage.user_provider_id ?? "",
        display_name: localStorage.displayName ?? "",
    }

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
            state.stage = "select"

        }
    })

    function finalize() {
        localStorage.login = state.login
        localStorage.displayName = state.display_name
        appState.setUserProviderId(user_provider_id)
        appState.setValue("username", state.login, appState.UPDATE_ADDRESS.NO)
        appState.setValue("display_name", state.display_name, appState.UPDATE_ADDRESS.NO)
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
        <TopLogo loginState={state}/>
    </div>

    {#if stage === "select"}
        <SelectLoginTypeStage bind:state/>

    {:else if stage === "login"}
        <LoginStage bind:state/>

    {:else if stage === "password"}
        <PasswordStage bind:state/>

    {:else if stage === "code"}
        <CodeStage bind:state/>

    {/if}
{/if}
