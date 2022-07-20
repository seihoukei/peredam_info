<script>
    import {createEventDispatcher} from "svelte"
    import Api from "../../../../../utility/api.js"

    export let provider
    export let values = {}

    const dispatch = createEventDispatcher()

    const getProviderDescription = Api.getProviderDescription(provider)

    const back = () => {
        provider = null
    }

    const finish = () => {
        dispatch("finish")
    }
</script>

{#await getProviderDescription}
    ...получение информации о поставщике...
{:then result}
    <span class="value-name">Название:</span> <span class="value"> {result.data.name}</span>
    <span class="value-name">Период:</span> <span class="value">{result.data.period}</span>
    {#each Object.entries(result.data.values) as [key, value]}
        {#if value.constant}
            <span class="value-name">{value.name}</span>
            <input placeholder={value.type} bind:value={values[key]} />
        {/if}
    {/each}
{/await}

<button on:click={finish}>Готово</button>
<button on:click={back}>Назад</button>

<style>
    span.value-name {
        font-size: var(--2u);
    }
    span.value {
        font-size: var(--2_5u);
        margin : 0 0 var(--2u);
    }
    input {
        margin : 0 0 var(--2u);
    }
</style>
