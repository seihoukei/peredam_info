<script>
    import LoginPrompt from "../elements/LoginPrompt.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import {loginFlyLeft} from "../../../utility/transitions.js"

    export let phone

    let raw = ""

    const dispatch = createEventDispatcher()

    function noPhone() {
        dispatch("nophone")
    }

    function nologin() {
        dispatch("nologin")
    }

    $: phone = `📞${raw.replace(/[^0-9]*/g,"").slice(-10)}`

</script>

<div class="central centered spaced flex container" transition:fly={loginFlyLeft}>
    <LoginPrompt type="tel" bind:value={raw} on:submit hint="Номер телефона">
        Введите номер телефона
    </LoginPrompt>
    <button on:click={noPhone}>◀ Вход без телефона</button>
    <br>
    <button on:click={nologin}>Просто передать показания</button>
</div>
