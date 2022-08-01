<script>
    import SetPassword from "components/login-sequence/stages/password/SetPassword.svelte"
    import RequestPassword from "components/login-sequence/stages/password/RequestPassword.svelte"

    import modal from "stores/modal.js"

    import Api from "utility/api.js"

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
            modal.success("Пользователь зарегистрирован!")
            state.tokens.current = result.data.token
            state.user_provider_id = null
            state.stage = "code"

        } else {
            modal.error(result.error)
            state.stage = "login"

        }
    }

    async function logIn() {
        const result = await modal.await(
            Api.logIn(login, password),
            "Попытка входа",
        )

        if (result.success) {
            modal.success("Вход удался!")
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
        <RequestPassword {login} bind:password on:cancel={back} on:submit={logIn}/>

    {/if}
{/if}
