<script>
    import {slide} from "svelte/transition"
    import FocusWatcher from "../../../utility/focus-watcher.js"
    import {onDestroy, onMount} from "svelte"

    export let name = ""
    export let value = ""
    export let type = "ANY"
    export let old = ""
    export let priority = 0

    let element = null

    $: inputType = type.split(":")[0]

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

<div class="centered spacy-below flex" transition:slide>
    <span class="center-text">{name}</span>
    {#if inputType === "NUM"}
        <input class="large" type="number" bind:value bind:this={element} placeholder={old} on:keydown={checkKey}/>
    {:else}
        <input class="large spacy-below" type="text" bind:this={element} bind:value placeholder={old} on:keydown={checkKey} />
    {/if}
</div>
