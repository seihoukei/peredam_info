<script>
    import CodeInput from "../elements/CodeInput.svelte"
    import {slide, fly} from "svelte/transition"
    import {createEventDispatcher} from "svelte"
    import {loginFlyLeft} from "../../../utility/transitions.js"

    export let code
    export let login
    export let changing = false

    let first = ""
    let repeat = false

    const dispatch = createEventDispatcher()

    function proceed() {
        if (first === "") {
            first = code
            code = ""
        } else {
            if (first === code)
                dispatch("submit")
            else {
                repeat = true
                first = ""
                code = ""
            }
        }
    }

    function cancel() {
        dispatch("cancel")
    }

    function nocode() {
        code = ""
        dispatch("submit")
    }

</script>

<div class="centered central spaced flex" transition:fly={loginFlyLeft}>
    <div class="message flex">
        {#if first === "" && !repeat}
            <div class="large center-text" transition:slide|local>Введите новый код для быстрого входа как {login}:</div>
        {:else if first === ""}
            <div class="large center-text" transition:slide|local>Введеные коды не совпали, попробуйте ещё раз:</div>
        {:else}
            <div class="large center-text" transition:slide|local>Введите тот же самый код ещё раз для проверки:</div>
        {/if}
    </div>
    <CodeInput bind:code on:submit={proceed}/>
    <div class="row-flex">
        {#if changing}
            <button on:click={nocode}>Убрать код</button>
        {:else}
            <button on:click={nocode}>Не надо кода</button>
        {/if}

        {#if changing}
            <button on:click={cancel}>Не надо ничего менять</button>
        {/if}
    </div>
</div>
