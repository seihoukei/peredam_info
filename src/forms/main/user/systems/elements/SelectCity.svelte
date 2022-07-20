<script>
    import Api from "../../../../../utility/api.js"
    import {slide} from "svelte/transition"

    export let city = null

    let getCities = Api.getCities()

    const switchCity = (value) => {
        if (city === value)
            city = null
        else
            city = value
    }
</script>

<div class="choice">
    {#await getCities}
        <span class="title" transition:slide>...получение списка городов...</span>
    {:then result}
        <span class="title" transition:slide>Город:</span>
        {#each Object.entries(result.data) as [cityName, id] (id)}
            {#if !city || city === id}
                <button on:click={()=>switchCity(id)} transition:slide>{cityName}</button>
            {/if}
        {/each}
    {/await}
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
