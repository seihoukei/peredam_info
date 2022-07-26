<script>
    import LoginPrompt from "../elements/LoginPrompt.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import {loginFlyLeft} from "../../../utility/transitions.js"
    import {failure, success} from "../../../utility/messages.js"

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
    $: extraCheck = checkPhone(phone)

    function checkPhone() {
        if (phone.slice(2).length < 5)
            return failure("Слишком короткий номер")

        if (phone.slice(2).length > 11)
            return failure("Слишком длинный номер")

        return success()
    }

</script>

<div class="central centered spaced flex container" transition:fly={loginFlyLeft}>
    <LoginPrompt type="tel" bind:value={raw} on:submit hint="Номер телефона" {extraCheck}>
        Введите номер телефона
    </LoginPrompt>
    <button on:click={noPhone}>◀ Вход без телефона</button>
    <br>
    <button on:click={nologin}>Просто передать показания</button>
</div>
