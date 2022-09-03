<script>
    import Transitions from "utility/transitions.js"
    import {fly} from "svelte/transition"
    import appState from "stores/app-state.js"

    export let state

    function useVK() {
        window.location = `https://oauth.vk.com/authorize
            ?client_id=51413821
            &display=page
            &redirect_uri=http://localhost:5173/auth/vk.html
            &scope=email
            &response_type=code
            &v=5.131
        `.split(/[ \t\n]/).join("")
    }

    function useGoogle() {
        window.location = `https://accounts.google.com/o/oauth2/v2/auth
            ?client_id=689057572164-bp6kpaeqhogqpnu8usqp6oq68l2ho0cu.apps.googleusercontent.com
            &redirect_uri=http://localhost:5173/auth/google.html
            &response_type=code
            &scope=openid%20profile%20email
        `.split(/[ \t\n]/).join("")
    }

    function usePhone() {
        state.stage = "login"
        state.usePhone = true
    }

    function useLogin() {
        state.stage = "login"
        state.usePhone = false
    }

    function setAnonymousMode() {
        appState.setPage("anon")
    }

    //https://oauth.vk.com/authorize?client_id=51413821&display=page&redirect_uri=http://localhost:5173/auth/vk.html&scope=email&response_type=code&v=5.131
</script>

<div class="central centered spaced flex container" transition:fly={Transitions.loginFlyRight}>
    <button on:click={useVK}>Войти через ВКонтакте</button>
    <button on:click={useGoogle}>Войти через Google</button>
    <button on:click={usePhone}>Войти по номеру телефона</button>
    <button on:click={useLogin}>Войти по имени пользователя</button>

    <br>
    <button on:click={setAnonymousMode}>Просто передать показания</button>
</div>
