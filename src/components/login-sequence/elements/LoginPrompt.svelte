<script>
    import {createEventDispatcher, onDestroy, onMount} from "svelte"

    import {failure, success} from "utility/messages.js"
    import FocusWatcher from "utility/focus-watcher.js"

    const dispatch = createEventDispatcher()
    // submit (value) - submit value

    export let type = "text"
    export let value
    export let hint = ""
    export let minLength = 5
    export let maxLength = 32
    export let extraCheck = success()
    export let login = ""
    export let autocomplete = ""

    let element

    $: validityCheck = validate(value, extraCheck)

    onMount(() => {
        FocusWatcher.addElement(element)
        FocusWatcher.focus(false)
    })

    function validate(value) {
        if (!extraCheck.success) {
            return failure(extraCheck.error)
        }

        if (value.length < minLength) {
            return failure(`Введите хотя бы ${minLength} символов`)
        }

        if (value.length > maxLength) {
            return failure(`Введите не более ${maxLength} символов`)
        }

        return success()
    }

    function submit() {
        if (validityCheck.success) {
            dispatch("submit", value)
        }
    }

    onDestroy(() => {
        FocusWatcher.removeElement(element)
    })

</script>

<div class="flex centered spaced container">
    <span class="large center-text prompt"><slot/></span>

    <form on:submit|preventDefault={submit}>
        <div class="input row-flex centered">
            {#if type === "tel"}
                <span class="tel-icon large">📞</span>
                <input class="large tel"
                       type="tel"
                       placeholder={hint}
                       {maxLength}
                       {autocomplete}
                       bind:this={element}
                       bind:value/>

            {:else if type === "number"}
                <input class="large"
                       type="number"
                       placeholder={hint}
                       {maxLength}
                       {autocomplete}
                       bind:this={element}
                       bind:value/>

            {:else if type === "password"}
                <input autocomplete="username"
                       type="text"
                       style:display="none"
                       value={login}/>

                <input class="large"
                       type="password"
                       placeholder={hint}
                       {autocomplete}
                       {maxLength}
                       bind:this={element}
                       bind:value/>

            {:else}
                <input class="large"
                       type="text"
                       placeholder={hint}
                       {maxLength}
                       {autocomplete}
                       bind:this={element}
                       bind:value/>
            {/if}

            <input class="large submit" disabled={!validityCheck.success} type="submit" value="▶"/>

        </div>
    </form>


    <span class="font-high" class:error={!validityCheck.success}>{validityCheck.data ?? ""}</span>

</div>

<style>
    div.container {

    }

    span.error {
        color: var(--status-error-color);
    }

    input:not([type='submit']) {
        border-radius: 32px 0 0 32px;
        height : 32px;

    }

    input.submit {
        margin-left: 0;
        height : 45px;
        border-radius: 0 32px 32px 0;
    }

    div.input {
        column-gap: 2px;
        justify-content: center;
        align-items: center;
    }

    input.tel {
        padding-left: 40px;
    }

    span.tel-icon {
        position: absolute;
        left : 7px;
        pointer-events: none;
    }
</style>
