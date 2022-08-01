<script>
    import RequestPhone from "components/login-sequence/stages/login/RequestPhone.svelte"
    import RequestUsername from 'components/login-sequence/stages/login/RequestUsername.svelte'
    import ConfirmNewUser from "components/login-sequence/stages/login/ConfirmNewUser.svelte"

    import modal from "stores/modal.js"

    import Api from "utility/api.js"

    export let state

    let isUsingPhone = true
    let login = state?.login ?? ""
    let isNewUser = false

    $: state.isNewUser = isNewUser
    $: state.login = login
    $: stage = state.stage

    function useLogin() {
        isUsingPhone = false
        login = ""
    }

    function usePhone() {
        isUsingPhone = true
        login = ""
    }

    async function checkLogin() {
        const result = await modal.await(
            Api.loginExists(state.login),
            "Поиск пользователя"
        )

        if (result.success) {
            if (result.data.exists) {
                modal.success("Пользователь найден!")
                state.stage = "password"

            } else {
                modal.success("Новый пользователь!")
                isNewUser = true

            }

        } else {
            modal.error(result.error)

        }
    }

    function confirmNewUser() {
        state.stage = "password"
    }

    function back() {
        isNewUser = false
        login = ""
    }

</script>

{#if state.stage === "login"}
    {#if isNewUser}
        <ConfirmNewUser {login} on:cancel={back} on:confirm={confirmNewUser}/>

    {:else if isUsingPhone}
        <RequestPhone bind:phone={login} on:submit={checkLogin} on:nophone={useLogin}/>

    {:else}
        <RequestUsername bind:username={login} on:submit={checkLogin} on:phone={usePhone}/>

    {/if}
{/if}
