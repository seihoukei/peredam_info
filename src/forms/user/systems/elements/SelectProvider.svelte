<script>
    import {slide} from "svelte/transition"
    import library from "../../../../stores/library.js"

    export let city_id = null
    export let current = null

    function switchCurrent(value)  {
        if (current === +value)
            current = null
        else
            current = +value
    }

</script>

{#if city_id !== null}
    {#if Object.keys(library.cities[city_id].providers).length}
        <div class="centered flex">
            {#if current === null}
                <span class="large spacy-below important" transition:slide>Выберите поставщика услуг:</span>
            {:else}
                <span transition:slide>Поставщик услуг:</span>
            {/if}
            {#each Object.entries(library.cities[city_id].providers) as [id, provider](id)}
                {#if !current || current === +id}
                    <div class="spacy-below centered flex" transition:slide>
                        <button class="large" on:click={()=>switchCurrent(id)}>
                            {current === +id ? "◀" : ""} {provider.name}
                        </button>
                        <span class="spacy-below">{provider.type}</span>
                    </div>
                {/if}
            {/each}
    </div>
    {:else}
        <span transition:slide>Здесь пока ничего нет</span>
    {/if}
{/if}
