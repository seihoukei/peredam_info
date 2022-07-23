<script>
    import {slide} from "svelte/transition"

    export let name = ""
    export let value = ""
    export let type = "ANY"
    export let old = ""

    $: inputType = type.split(":")[0]
</script>

<div class="centered spacy-below flex" transition:slide>
    <span class="center-text">{name}</span>
    {#if inputType === "NUM"}
        <input class="large" type="number" bind:value placeholder={old} autofocus />
    {:else}
        <input class="large spacy-below" type="text" bind:value placeholder={old} autofocus  />
    {/if}
</div>
