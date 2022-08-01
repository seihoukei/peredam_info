<script>
    import {slide} from "svelte/transition"
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

    export let isValueReady

    let element = null

    $: inputType = description.type.split(":")[0]
    $: isInvalid = description.mandatory && Values.formatValue(description.type, value) === null
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

<div class="centered flex" transition:slide>
    <span class="center-text" class:important={isInvalid}>
        {description.name}
        {#if description.mandatory}
            *
        {/if}
    </span>

    {#if inputType === "NUM"}
        <input class="large spacy-below"
               type="number"
               {placeholder}
               bind:this={element}
               bind:value
               on:keydown={checkKey} />

    {:else}
        <input class="large spacy-below"
               type="text"
               {placeholder}
               bind:this={element}
               bind:value
               on:keydown={checkKey} />

    {/if}

</div>
