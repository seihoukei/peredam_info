<script>
    import RequestPhone from "./login-sequence/stages/RequestPhone.svelte"
    import RequestUsername from "./login-sequence/stages/RequestUsername.svelte"
    import RequestPassword from "./login-sequence/stages/RequestPassword.svelte"
    import ConfirmNewUser from "./login-sequence/stages/ConfirmNewUser.svelte"
    import SetPassword from "./login-sequence/stages/SetPassword.svelte"
    import SetCode from "./login-sequence/stages/SetCode.svelte"
    import RequestCode from "./login-sequence/stages/RequestCode.svelte"
    import Error from "./login-sequence/stages/Error.svelte"
    import Waiting from "./login-sequence/stages/Waiting.svelte"

    import Tokens from "../utility/tokens.js"
    import Api from "../utility/api.js"

    export let token
    export let login

    let password = ""
    let code = ""
    let status = ""
    let isUsingPhone = true
    let errorRetryStage = null

    let tokens = Tokens.retrieve()

    $: Tokens.store(tokens)

    const STAGES = {
        NONE : 0,
        REQUEST_USERNAME : 11,
        CONFIRM_NEW_USER : 12,
        SET_NEW_PASSWORD : 20,
        REQUEST_OLD_PASSWORD : 30,
        SET_CODE : 40,
        REQUEST_CODE : 50,

        WAITING : 100,
        COMPLETE : 101,
        ERROR : 102,
    }

    let stage = STAGES.REQUEST_USERNAME

    if (tokens.current !== "") {
        finalize()
    } else if (tokens.encrypted !== "") {
        stage = STAGES.REQUEST_CODE
    } else if (login !== "") {
        stage = STAGES.REQUEST_OLD_PASSWORD
    }

    function error(message, retryStage = STAGES.REQUEST_USERNAME) {
        status = message
        errorRetryStage = retryStage
    }

    function retry() {
        stage = errorRetryStage
    }

    function restart() {
        stage = STAGES.REQUEST_USERNAME
        login = ""
        password = ""
        code = ""
        tokens = {
            current: "",
            encrypted: "",
            open: "",
        }
    }

    function useLogin() {
        isUsingPhone = false
        login = ""
    }

    function usePhone() {
        isUsingPhone = true
        login = ""
    }

    function usePassword() {
        Tokens.clear()
        stage = STAGES.REQUEST_OLD_PASSWORD
    }

    function newUser() {
        stage = STAGES.SET_NEW_PASSWORD
        password = ""
    }

    function setCode() {
        if (code === "") {
            tokens.open = tokens.current
            tokens.encrypted = ""
            finalize()
        } else {
            const result = Tokens.encrypt(tokens.current, code)

            if (result.success) {
                tokens.encrypted = result.data
                tokens.open = ""
                finalize()
            } else {
                error("Ошибка шифрования", STAGES.SET_CODE)
            }
        }

    }

    function checkCode() {
        const result = Tokens.decrypt(tokens.encrypted, code)

        if (result.success) {
            tokens.current = result
            finalize()

        } else {
            error("Неправильный код")
            code = ""
        }
    }

    function finalize() {
        token = tokens.current
        stage = STAGES.COMPLETE

    }

    async function checkLogin() {
        stage = STAGES.WAITING
        status = "Поиск пользователя"
        const result = await Api.loginExists(login)

        if (result.success) {
            if (result.data.exists) {
                password = ""
                stage = STAGES.REQUEST_OLD_PASSWORD
            } else {
                stage = STAGES.CONFIRM_NEW_USER
            }
        } else {
            error(result.error)
        }
    }

    async function register() {
        stage = STAGES.WAITING
        status = "Регистрация пользователя"
        const result = await Api.register(login, password)

        if (result.success) {
            tokens.current = result.data.token
            localStorage.login = login
            code = ""
            stage = STAGES.SET_CODE

        } else {
            login = ""
            error(result.error)
        }
    }

    async function log_in() {
        stage = STAGES.WAITING
        status = "Попытка входа"
        const result = await Api.logIn(login, password)

        if (result.success) {
            tokens.current = result.data.token
            localStorage.login = login
            code = ""
            stage = STAGES.SET_CODE

        } else {
            password = ""
            error(result.error, STAGES.REQUEST_OLD_PASSWORD)
        }
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">{JSON.stringify(tokens,null,1)}</pre>
{/if}

{#if stage === STAGES.REQUEST_USERNAME}
    {#if isUsingPhone}
        <RequestPhone bind:phone={login} on:submit={checkLogin} on:nophone={useLogin}/>
    {:else}
        <RequestUsername bind:username={login} on:submit={checkLogin} on:phone={usePhone}/>
    {/if}

{:else if stage === STAGES.CONFIRM_NEW_USER}
    <ConfirmNewUser {login} on:cancel={restart} on:confirm={newUser}/>
{:else if stage === STAGES.SET_NEW_PASSWORD}
    <SetPassword {login} bind:password on:cancel={restart} on:submit={register}/>
{:else if stage === STAGES.REQUEST_OLD_PASSWORD}
    <RequestPassword {login} bind:password on:cancel={restart} on:submit={log_in}/>

{:else if stage === STAGES.SET_CODE}
    <SetCode {login} bind:code on:cancel={restart} on:submit={setCode}/>
{:else if stage === STAGES.REQUEST_CODE}
    <RequestCode {login} bind:code on:cancel={usePassword} on:submit={checkCode}/>

{:else if stage === STAGES.WAITING}
    <Waiting message={status} />
{:else if stage === STAGES.ERROR}
    <Error message={status} on:click={retry} />

{:else if stage === STAGES.COMPLETE}

{/if}

<style>

</style>
