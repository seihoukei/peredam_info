<script>
    import CodeInput from "components/login-sequence/elements/CodeInput.svelte"

    import {fly, slide} from "svelte/transition"
    import {createEventDispatcher} from "svelte"

    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // cancel - use password

    export let code
    export let display_name

    function cancel() {
        dispatch("cancel")
    }

</script>

<div class="centered central spaced flex" transition:fly={Transitions.loginFlyRight}>
    <div class="large important center-text" transition:slide|local>
        Введите код для быстрого входа как
        <span class="nowrap">{display_name}</span>:
    </div>

    <CodeInput bind:code on:submit/>

    <div class="row-flex">
        <button on:click={cancel}>◀ Войти с паролем</button>
    </div>

</div>
