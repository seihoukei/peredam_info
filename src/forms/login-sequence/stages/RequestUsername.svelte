<script>
    import LoginPrompt from "../LoginPrompt.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import {loginFlyLeft} from "../../../utility/transitions.js"

    export let username

    const dispatch = createEventDispatcher()

    function phone() {
        dispatch("phone")
    }

    $: username = username.replace(/[^0-9a-zA-Zа-яА-Я_\- ]*/g,"")

</script>

<div class="central centered spaced flex container" transition:fly={loginFlyLeft}>
    <LoginPrompt bind:value={username} on:submit hint="Имя пользователя">
        Введите имя пользователя
    </LoginPrompt>
    <button on:click={phone}>◀ Вход по номеру телефона</button>
</div>
