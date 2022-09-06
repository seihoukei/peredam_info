<script>
    import {onDestroy, onMount} from "svelte"

    import FocusWatcher from "utility/focus-watcher.js"
    import Values from "utility/values.js"

    export let priority = 0
    export let value = ""
    export let placeholder = ""

    export let description = {
        name : "",
        type : "ANY",
        mandatory : false
    }

    export let isValueReady = false

    let element = null
    let temp = value ?? ""

    $: inputType = description.type.split(":")[0]
    $: value = Values.formatValue(description.type, temp)
    $: isInvalid = description.mandatory && value === ""
    $: isValueReady = !isInvalid

    onMount(() => {
        FocusWatcher.addElement(element, priority)
        FocusWatcher.focus(true)
    })

    function checkKey({keyCode}) {
        if (keyCode === 13) {
            FocusWatcher.focusNext(element, true)
        }
    }

    onDestroy(() => {
        FocusWatcher.removeElement(element)
    })
</script>

<div class="centered flex spacy-below">
    <span class="center-text" class:important={isInvalid}>
        {description.name}
        {#if description.mandatory}
            *
        {/if}
    </span>

    {#if inputType === "NUM"}
        <input class="large"
               type="number"
               {placeholder}
               bind:this={element}
               bind:value={temp}
               on:keydown={checkKey} />

    {:else}
        <input class="large"
               type="text"
               {placeholder}
               bind:this={element}
               bind:value={temp}
               on:keydown={checkKey} />

    {/if}

</div>
