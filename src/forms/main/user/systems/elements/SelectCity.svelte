<script>
    import Api from "../../../../../utility/api.js"

    export let city

    let getCities = Api.getCities()

    const setCity = (value) => {
        city = value
    }
</script>

{#await getCities}
    ...получение списка городов...
{:then result}
    {#each Object.entries(result.data) as [cityName, id]}
        <button on:click={()=>setCity(id)}>{cityName}</button><br>
    {/each}
{/await}
