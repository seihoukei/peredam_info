<script>
    import {createEventDispatcher} from "svelte"
    import {failure, success} from "../../utility/messages.js"

    export let type = "text"
    export let value
    export let hint
    export let minLength = 5
    export let maxLength = 32

    const dispatch = createEventDispatcher()

    $: validityCheck = validate(value)

    function validate(value) {
        if (value.length < minLength)
            return failure(`Введите хотя бы ${minLength} символов`)

        if (value.length > maxLength)
            return failure(`Введите не более ${maxLength} символов`)

        return success()
    }

    function checkKey(event) {
        if (event.keyCode === 13)
            submit()
    }

    function submit() {
        if (validityCheck.success)
            dispatch("submit", value)
    }

</script>

<div class="flex centered spaced container">
    <span class="large prompt"><slot /></span>
    <div class="input flex">
        {#if type === "tel"}
            <input class="large" type="tel" bind:value placeholder={hint} on:keydown={checkKey} maxlength={maxLength}/>
        {:else if type === "number"}
            <input class="large" type="number" bind:value placeholder={hint} on:keydown={checkKey} maxlength={maxLength}/>
        {:else if type === "password"}
            <input class="large" type="password" bind:value placeholder={hint} on:keydown={checkKey} maxlength={maxLength}/>
        {:else}
            <input class="large" bind:value placeholder={hint} on:keydown={checkKey}/>
        {/if}
        <button class="large submit" on:click={submit} disabled={!validityCheck.success}>▶</button>
    </div>
    <span class="validation" class:error={!validityCheck.success}>{validityCheck.data ?? ""}</span>
</div>

<style>
    div.container {

    }

    span.validation {
        height : var(--font-size);
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
        flex-direction: row;
        column-gap : 2px;
    }
</style>
