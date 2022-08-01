<script>
    import LoginPrompt from "components/login-sequence/elements/LoginPrompt.svelte"

    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"

    import appState from "stores/app-state.js"

    import {failure, success} from "utility/messages.js"
    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // nophone - switch to username method

    export let phone

    let input = ""

    $: phone = `📞${input.replace(/[^0-9]*/g, "").slice(-10)}`
    $: extraCheck = checkPhone(phone)

    function useLogin() {
        dispatch("nophone")
    }

    function setAnonymousMode() {
        appState.setPage("anon")
    }

    function checkPhone() {
        if (phone.slice(2).length < 5) {
            return failure("Слишком короткий номер")
        }

        if (phone.slice(2).length > 11) {
            return failure("Слишком длинный номер")
        }

        return success()
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

    <button on:click={useLogin}>◀ Вход без телефона</button>

    <br>
    <button on:click={setAnonymousMode}>Просто передать показания</button>
</div>
