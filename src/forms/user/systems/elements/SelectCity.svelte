<script>
    import {slide} from "svelte/transition"
    import library from "../../../../stores/library.js"

    export let current = null

    $: if (Object.keys(library.cities).length === 1)
        current = Object.keys(library.cities)[0]

    function switchCurrent(value) {
        if (current === value)
            current = null
        else
            current = value
    }
</script>

<div class="centered flex">
    {#if current === null}
        <span class="large spacy-below important" transition:slide>Выберите город:</span>
    {:else}
        <span transition:slide>Город:</span>
    {/if}

    {#each Object.entries(library.cities) as [id, city] (id)}
        {#if !current || current === id}
            <button class="large spacy-below" on:click={()=>switchCurrent(id)} transition:slide>
                {current === id ? "◀" : ""} {city.name}
            </button>
        {/if}
    {/each}
</div>
