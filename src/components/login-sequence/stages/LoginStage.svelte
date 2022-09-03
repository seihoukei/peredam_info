<script>
    import RequestPhone from "components/login-sequence/stages/login/RequestPhone.svelte"
    import RequestUsername from "components/login-sequence/stages/login/RequestUsername.svelte"
    import ConfirmNewUser from "components/login-sequence/stages/login/ConfirmNewUser.svelte"

    import apiStatus from "stores/api-status.js"

    import Api from "utility/api.js"

    export let state

    let login = state?.login ?? ""
    let isNewUser = false

    $: state.isNewUser = isNewUser
    $: state.login = login
    $: stage = state.stage

    async function checkLogin() {
        const result = await apiStatus.await(
            Api.loginExists(state.login),
            "Поиск пользователя"
        )

        if (result.success) {
            if (result.data.exists) {
                apiStatus.success("Пользователь найден!")
                state.stage = "password"

            } else {
                apiStatus.success("Новый пользователь!")
                isNewUser = true

            }

        } else {
            apiStatus.error(result.error)

        }
    }

    function confirmNewUser() {
        state.stage = "password"
    }

    function back() {
        isNewUser = false
        login = ""
        state.stage = "select"
    }

</script>

{#if state.stage === "login"}
    {#if isNewUser}
        <ConfirmNewUser {login} on:cancel={back} on:confirm={confirmNewUser}/>

    {:else if state.usePhone}
        <RequestPhone bind:phone={login} on:submit={checkLogin} on:cancel={back}/>

    {:else}
        <RequestUsername bind:username={login} on:submit={checkLogin} on:cancel={back}/>

    {/if}
{/if}
