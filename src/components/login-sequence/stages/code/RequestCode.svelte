<script>
    import CodeInput from "../../elements/CodeInput.svelte"
    import {fly, slide} from "svelte/transition"
    import {createEventDispatcher} from "svelte"
    import Transitions from "../../../../utility/transitions.js"

    export let code
    export let login

    const dispatch = createEventDispatcher()

    function cancel() {
        dispatch("cancel")
    }

</script>

<div class="centered central spaced flex" transition:fly={Transitions.loginFlyRight}>
    <div class="large center-text" transition:slide|local>
        Введите код для быстрого входа как <span class="nowrap">{login}</span>:
    </div>
    <CodeInput bind:code on:submit/>
    <div class="row-flex ">
        <button on:click={cancel}>◀ Войти с паролем</button>
    </div>
</div>
