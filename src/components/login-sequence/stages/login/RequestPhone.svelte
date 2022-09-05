<script>
    import LoginPrompt from "components/login-sequence/elements/LoginPrompt.svelte"

    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"

    import appState from "stores/app-state.js"

    import Messages from "utility/messages.js"
    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // nophone - switch to username method

    export let phone

    let input = ""

    $: phone = `phone:${input.replace(/[^0-9]*/g, "").slice(-10)}`
    $: extraCheck = checkPhone(phone)

    function otherMethod() {
        dispatch("cancel")
    }

    function setAnonymousMode() {
        appState.setPage("anon")
    }

    function checkPhone() {
        if (phone.slice(6).length < 5) {
            return Messages.failure("Слишком короткий номер")
        }

        if (phone.slice(6).length > 11) {
            return Messages.failure("Слишком длинный номер")
        }

        return Messages.success()
    }

</script>

<div class="central centered spaced flex container" transition:fly={Transitions.loginFlyLeft}>
    <LoginPrompt autocomplete="tel-national"
                 hint="Номер телефона"
                 {extraCheck}
                 bind:value={input}
                 on:submit type="tel">
        Введите номер телефона
    </LoginPrompt>

    <button on:click={otherMethod}>◀ Другой способ входа</button>

    <br>
    <button on:click={setAnonymousMode}>Просто передать показания</button>
</div>
