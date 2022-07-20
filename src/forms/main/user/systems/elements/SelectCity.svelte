<script>
    import Api from "../../../../../utility/api.js"

    export let city

    let getCities = Api.getCities()

    const setCity = (value) => {
        city = value
    }
</script>

<div class="choice">
{#await getCities}
    ...получение списка городов...
{:then result}
    Выберите город:
    {#each Object.entries(result.data) as [cityName, id]}
        <button on:click={()=>setCity(id)}>{cityName}</button>
    {/each}
{/await}
</div>

<style>
    div.choice {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: var(--1u);
        padding: var(--3u);
    }
</style>
