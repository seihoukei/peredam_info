<script>
    import Api from "../../../../../utility/api.js"
    import {slide} from "svelte/transition"

    export let city = null
    export let provider = null

    const getProviders = async () => {
        provider = null
        return Api.getProviders(city)
    }

    const switchProvider = (value) => {
        if (provider === value)
            provider = null
        else
            provider = value
    }
</script>

<div class="choice">
    {#await getProviders()}
        <span class="title" transition:slide>...получение списка поставщиков...</span>
    {:then result}
        <span class="title" transition:slide>Поставщик услуг:</span>
        {#each Object.entries(result.data) as [providerName, id](id)}
            {#if !provider || provider === id}
                <button on:click={()=>switchProvider(id)} transition:slide>{providerName}</button>
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
