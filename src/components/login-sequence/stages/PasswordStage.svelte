<script>
    import SetPassword from "./password/SetPassword.svelte"
    import RequestPassword from "./password/RequestPassword.svelte"

    import Api from "../../../utility/api.js"
    import modal from "../../../stores/modal.js"

    export let state

    let password = ""

    $: isNewUser = state.isNewUser
    $: login = state.login
    $: stage = state.stage

    async function register() {
        const result = await modal.await(
            Api.register(login, password),
            "Регистрация пользователя",
        )

        if (result.success) {
            state.tokens.current = result.data.token
            state.user_provider_id = null
            state.stage = "code"

        } else {
            modal.error(result.error)
            state.stage = "login"

        }
    }

    async function log_in() {
        const result = await modal.await(
            Api.logIn(login, password),
            "Попытка входа",
        )

        if (result.success) {
            state.tokens.current = result.data.token
            state.user_provider_id = result.data.provider ?? null
            state.stage = "code"

        } else {
            modal.error(result.error)
            password = ""
        }
    }

    function back() {
        state.stage = "login"
    }

</script>

{#if stage === "password"}
    {#if isNewUser}
        <SetPassword {login} bind:password on:cancel={back} on:submit={register}/>
    {:else}
        <RequestPassword {login} bind:password on:cancel={back} on:submit={log_in}/>
    {/if}
{/if}
