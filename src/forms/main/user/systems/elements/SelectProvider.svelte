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

{#await getProviders}
    ...получение списка поставщиков...
{:then result}
    {#each Object.entries(result.data) as [providerName, id]}
        <button on:click={()=>setProvider(id)}>{providerName}</button><br>
    {/each}
{/await}
<button on:click={back}>Назад</button>
