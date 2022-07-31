<script>
    import LoginPrompt from "../../elements/LoginPrompt.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import Transitions from "../../../../utility/transitions.js"
    import appState from "../../../../stores/app-state.js"

    export let username

    const dispatch = createEventDispatcher()

    function phone() {
        dispatch("phone")
    }

    function nologin() {
        appState.setPage("anon")
    }

    $: username = username.replace(/[^0-9a-zA-Zа-яА-Я_\- ]*/g, "")

</script>

<div class="central centered spaced flex container" transition:fly={Transitions.loginFlyLeft}>
    <LoginPrompt autocomplete="username" bind:value={username} hint="Имя пользователя" on:submit>
        Введите имя пользователя
    </LoginPrompt>
    <button on:click={phone}>◀ Вход по номеру телефона</button>
    <br>
    <button on:click={nologin}>Просто передать показания</button>
</div>
