<script>
    import LoginPrompt from "components/login-sequence/elements/LoginPrompt.svelte"

    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"

    import appState from "stores/app-state.js"

    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // phone - switch to phone method

    export let username

    $: username = username.replace(/[^0-9a-zA-Zа-яА-Я_\- ]*/g, "")

    function otherMethod() {
        dispatch("cancel")
    }

    function setAnonymousMode() {
        appState.setPage("anon")
    }

</script>

<div class="central centered spaced flex container" transition:fly={Transitions.loginFlyLeft}>
    <LoginPrompt autocomplete="username"
                 hint="Имя пользователя"
                 bind:value={username}
                 on:submit>
        Введите имя пользователя
    </LoginPrompt>

    <button on:click={otherMethod}>◀ Другой способ входа</button>

    <br>
    <button on:click={setAnonymousMode}>Просто передать показания</button>
</div>
