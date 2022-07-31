<script>
    import LoginPrompt from "../../elements/LoginPrompt.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import Transitions from "../../../../utility/transitions.js"
    import appState from "../../../../stores/app-state.js"

    export let login
    export let password

    const dispatch = createEventDispatcher()

    function cancel() {
        dispatch("cancel")
    }

    function nologin() {
        appState.setPage("anon")
    }

</script>

<div class="central centered spaced flex container" transition:fly={Transitions.loginFlyRight}>
    <LoginPrompt autocomplete="" bind:value={password} hint="Пароль" {login} minLength=0 on:submit type="password">
        Введите пароль пользователя <span class="nowrap">{login}</span>
    </LoginPrompt>
    <button on:click={cancel}>◀ Другой пользователь</button>
    <br>
    <button on:click={nologin}>Просто передать показания</button>
</div>
