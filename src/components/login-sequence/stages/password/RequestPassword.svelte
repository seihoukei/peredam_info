<script>
    import LoginPrompt from "components/login-sequence/elements/LoginPrompt.svelte"

    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"

    import appState from "stores/app-state.js"

    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // cancel - change user

    export let login
    export let password
    export let display_name

    function cancel() {
        dispatch("cancel")
    }

    function useAnonymousMode() {
        appState.setPage("anon")
    }

</script>

<div class="central centered spaced flex container" transition:fly={Transitions.loginFlyRight}>
    <LoginPrompt autocomplete="password"
                 type="password"
                 hint="Пароль"
                 {login}
                 bind:value={password}
                 on:submit>
        Введите пароль пользователя
        <span class="nowrap">{display_name}</span>
    </LoginPrompt>

    <button on:click={cancel}>◀ Другой пользователь</button>

    <br>
    <button on:click={useAnonymousMode}>Просто передать показания</button>
</div>
