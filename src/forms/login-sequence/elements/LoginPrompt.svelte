<script>
    import {createEventDispatcher, onDestroy, onMount} from "svelte"
    import {failure, success} from "../../../utility/messages.js"
    import FocusWatcher from "../../../utility/focus-watcher.js"

    export let type = "text"
    export let value
    export let hint
    export let minLength = 5
    export let maxLength = 32
    export let extraCheck = success()

    let element

    const dispatch = createEventDispatcher()

    $: validityCheck = validate(value, extraCheck)

    function validate(value) {
        if (!extraCheck.success)
            return failure(extraCheck.error)

        if (value.length < minLength)
            return failure(`Введите хотя бы ${minLength} символов`)

        if (value.length > maxLength)
            return failure(`Введите не более ${maxLength} символов`)

        return success()
    }

    function checkKey({keyCode}) {
        if (keyCode === 13)
            submit()
    }

    function submit() {
        if (validityCheck.success)
            dispatch("submit", value)
    }

    onMount(() => {
        FocusWatcher.addElement(element)
        FocusWatcher.focus(false)
    })

    onDestroy(() => {
        FocusWatcher.removeElement(element)
    })

</script>

<div class="flex centered spaced container">
    <span class="large center-text prompt"><slot /></span>
    <div class="input row-flex centered">
        {#if type === "tel"}
            <span class="tel-icon large">📞</span>
            <input bind:this={element} class="large tel" type="tel" bind:value placeholder={hint} on:keydown={checkKey} maxlength={maxLength}/>
        {:else if type === "number"}
            <input bind:this={element} class="large" type="number" bind:value placeholder={hint} on:keydown={checkKey} maxlength={maxLength}/>
        {:else if type === "password"}
            <input bind:this={element} class="large" type="password" bind:value placeholder={hint} on:keydown={checkKey} maxlength={maxLength}/>
        {:else}
            <input bind:this={element} class="large" bind:value placeholder={hint} on:keydown={checkKey}/>
        {/if}
        <button class="large submit" on:click={submit} disabled={!validityCheck.success}>▶</button>
    </div>
    <span class="font-high" class:error={!validityCheck.success}>{validityCheck.data ?? ""}</span>
</div>

<style>
    div.container {

    }

    span.error {
        color : var(--status-error-color);
    }

    input {
        border-radius: 20px 0 0 20px;
    }

    button.submit {
        margin-left : 0;
        border-radius: 0 20px 20px 0;
    }

    div.input {
        column-gap : 2px;
    }

    input.tel {
        padding-left : 40px;
    }

    span.tel-icon {
        position : absolute;
        padding : 5px;
        pointer-events: none;
    }
</style>
