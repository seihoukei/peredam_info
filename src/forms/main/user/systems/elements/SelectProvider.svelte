<script>
    import {slide} from "svelte/transition"
    import library from "../../../../../stores/library.js"

    export let city = null
    export let current = null

    const switchCurrent = (value) => {
        if (current === value)
            current = null
        else
            current = value
    }

</script>

{#if city !== null}
    {#if Object.keys($library.cities[city].providers).length}
        <div class="choice">
            <span class="title" transition:slide>Поставщик услуг:</span>
            {#each Object.entries($library.cities[city].providers) as [id, provider](id)}
                {#if !current || current === id}
                    <div class="item" transition:slide>
                        <button on:click={()=>switchCurrent(id)}>{provider.name}</button>
                        <span class="comment">{provider.type}</span>
                    </div>
                {/if}
            {/each}
    </div>
    {:else}
        <span transition:slide>Здесь пока ничего нет</span>
    {/if}
{/if}
<style>
    span.title {
        font-size: var(--2u);
        margin: 0 0 var(--2u);
    }
    div.item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 0 var(--2u);
    }
    span.comment {
        font-size: var(--2u);
    }
    div.choice {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
