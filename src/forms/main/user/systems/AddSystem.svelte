<script>
    import Api from "../../../../utility/api.js"
    import SelectCity from "./elements/SelectCity.svelte"
    import SelectProvider from "./elements/SelectProvider.svelte"
    import SetValues from "./elements/SetValues.svelte"

    export let system = {}
    export let adding = true

    const back = () => {
        adding = false
    }

    let city = null
    let provider = null
    let values = {}

    $: settingCity = city === null
    $: settingProvider = !settingCity && provider === null
    $: settingValues = !settingProvider

    $: system = {
        city, provider, values
    }

    const finalize = () => {
        adding = false
    }

</script>

<pre>
Добавление системы
{JSON.stringify(system, null, 1)}
</pre>
{#if settingCity}
    <SelectCity bind:city />
{:else if settingProvider}
    <SelectProvider bind:city bind:provider/>
{:else if settingValues}
    <SetValues bind:provider bind:values on:finish={finalize}/>
{/if}
<button on:click={back}>Отмена</button>
