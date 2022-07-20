<script>
    import Api from "../../../../../utility/api.js"

    export let city
    export let provider

    let getProviders = Api.getProviders(city)

    const setProvider = (value) => {
        provider = value
    }

    const back = () => {
        city = null
    }
</script>

<div class="choice">
{#await getProviders}
    ...получение списка поставщиков...
{:then result}
    Выберите поставщика:
    {#each Object.entries(result.data) as [providerName, id]}
        <button on:click={()=>setProvider(id)}>{providerName}</button>
    {/each}
{/await}
</div>
<button on:click={back}>Назад</button>

<style>
    div.choice {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: var(--1u);
        padding: var(--3u);
    }
</style>
