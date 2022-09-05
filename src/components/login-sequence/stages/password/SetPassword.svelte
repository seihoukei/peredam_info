<script>
    import LoginPrompt from "components/login-sequence/elements/LoginPrompt.svelte"

    import {createEventDispatcher} from "svelte"
    import {fly, slide} from "svelte/transition"

    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // submit - set password
    // cancel - change user

    export let login
    export let password
    export let display_name

    let first = ""
    let repeat = false

    let hint = "Новый пароль"

    function proceed() {
        if (first === "") {
            first = password
            hint = "Повторите пароль"
            password = ""

        } else {
            if (first === password) {
                dispatch("submit")

            } else {
                repeat = true
                first = ""
                password = ""
                hint = "Новый пароль"

            }
        }
    }

    function cancel() {
        dispatch("cancel")
    }

</script>

<div class="central centered spaced flex container" transition:fly={Transitions.loginFlyRight}>
    {#key first}
        <LoginPrompt autocomplete="new-password"
                     type="password"
                     bind:value={password}
                     {login}
                     hint={hint}
                     minLength=6
                     on:submit={proceed}>

            {#if first === "" && !repeat}
                <div class="center-text" transition:slide|local>
                    Введите новый пароль для пользователя
                    <span class="nowrap">{display_name}</span>:
                </div>

            {:else if first === ""}
                <div class="center-text" transition:slide|local>
                    Введеные пароли не совпали, попробуйте ещё раз:
                </div>

            {:else}
                <div class="center-text" transition:slide|local>
                    Введите тот же самый пароль ещё раз для проверки:
                </div>

            {/if}

        </LoginPrompt>

    {/key}

    <button on:click={cancel}>◀ Другой пользователь</button>

</div>
