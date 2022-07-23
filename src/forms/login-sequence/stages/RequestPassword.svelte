<script>
    import LoginPrompt from "../LoginPrompt.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import {loginFlyRight} from "../../../utility/transitions.js"

    export let login
    export let password

    const dispatch = createEventDispatcher()

    function cancel() {
        dispatch("cancel")
    }

</script>

<div class="central centered spaced flex container" transition:fly={loginFlyRight}>
    <LoginPrompt type="password" bind:value={password} on:submit hint="Пароль" minLength=0>
        Введите пароль пользователя {login}
    </LoginPrompt>
    <button on:click={cancel}>◀ Другой пользователь</button>
</div>
