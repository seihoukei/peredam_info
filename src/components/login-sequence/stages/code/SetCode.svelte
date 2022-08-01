<script>
    import CodeInput from "components/login-sequence/elements/CodeInput.svelte"

    import {fly, slide} from "svelte/transition"
    import {createEventDispatcher} from "svelte"

    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // submit - set code
    // cancel - don't change code (in changing mode)

    export let code
    export let login
    export let changing = false

    let first = ""
    let repeat = false

    function proceed() {
        if (first === "") {
            first = code
            code = ""

        } else {
            if (first === code) {
                dispatch("submit")

            } else {
                repeat = true
                first = ""
                code = ""

            }
        }
    }

    function cancel() {
        dispatch("cancel")
    }

    function proceedWithoutCode() {
        code = ""
        dispatch("submit")
    }

</script>

<div class="centered central spaced flex" transition:fly={Transitions.loginFlyLeft}>
    <div class="message flex">
        {#if first === "" && !repeat}
            <div class="large center-text" transition:slide|local>
                Введите новый код для быстрого входа как
                <span class="nowrap">{login}</span>:
            </div>

        {:else if first === ""}
            <div class="large center-text" transition:slide|local>
                Введеные коды не совпали, попробуйте ещё раз:
            </div>

        {:else}
            <div class="large center-text" transition:slide|local>
                Введите тот же самый код ещё раз для проверки:
            </div>

        {/if}

    </div>

    <CodeInput bind:code on:submit={proceed}/>

    <div class="row-flex">
        {#if changing}
            <button on:click={proceedWithoutCode}>Убрать код</button>

        {:else}
            <button on:click={proceedWithoutCode}>Не надо кода</button>

        {/if}

        {#if changing}
            <button on:click={cancel}>Не надо ничего менять</button>
        {/if}

    </div>

</div>
