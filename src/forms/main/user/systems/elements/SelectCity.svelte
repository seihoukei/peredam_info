<script>
    import {slide} from "svelte/transition"
    import library from "../../../../../stores/library.js"

    export let current = null

    $: if (Object.keys(library.cities).length === 1)
        current = Object.keys(library.cities)[0]

    const switchCurrent = (value) => {
        if (current === value)
            current = null
        else
            current = value
    }
</script>

<div class="choice">
    <span class="title" transition:slide>Город:</span>
    {#each Object.entries(library.cities) as [id, city] (id)}
        {#if !current || current === id}
            <button on:click={()=>switchCurrent(id)} transition:slide>{city.name}</button>
        {/if}
    {/each}
</div>

<style>
    span.title {
        font-size: var(--2u);
        margin: 0 0 var(--2u);
    }
    div.choice {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    button {
        margin: 0 0 var(--2u);
    }
</style>
