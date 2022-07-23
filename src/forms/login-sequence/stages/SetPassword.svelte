<script>
    import LoginPrompt from "../LoginPrompt.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly, slide} from "svelte/transition"
    import {loginFlyRight} from "../../../utility/transitions.js"

    export let login
    export let password

    let first = ""
    let repeat = false

    const dispatch = createEventDispatcher()

    function proceed() {
        if (first === "") {
            first = password
            password = ""
        } else {
            if (first === password)
                dispatch("submit")
            else {
                repeat = true
                first = ""
                password = ""
            }
        }
    }

    function cancel() {
        dispatch("cancel")
    }

</script>

<div class="central centered spaced flex container" transition:fly={loginFlyRight}>
    <LoginPrompt type="password" on:submit={proceed} bind:value={password} hint="Новый пароль" minLength=6>
        {#if first === "" && !repeat}
            <div class="center-text" transition:slide|local>Введите новый пароль для пользователя {login}:</div>
        {:else if first === ""}
            <div class="center-text" transition:slide|local>Введеные пароли не совпали, попробуйте ещё раз:</div>
        {:else}
            <div class="center-text" transition:slide|local>Введите тот же самый пароль ещё раз для проверки:</div>
        {/if}
    </LoginPrompt>
    <button on:click={cancel}>◀ Другой пользователь</button>
</div>
