<script>
    import SelectCity from "./elements/SelectCity.svelte"
    import SelectProvider from "./elements/SelectProvider.svelte"
    import SetValues from "./elements/SetValues.svelte"
    import {slide} from "svelte/transition"

    export let adding = true
    export let systems = []

    const back = () => {
        adding = false
    }

    let city = null
    let provider = null
    let values = {}
    let ready = false

    $: if (city === null)
        provider = null

    $: newSystem = {
        provider, values
    }

    $: values = empty(provider)

    function empty() {
        return {}
    }

    function finalize () {
        systems = [...systems, newSystem]
        adding = false
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Добавление системы{JSON.stringify(newSystem, null, 1)}</pre>
{/if}

<SelectCity bind:current={city} />
<SelectProvider {city} bind:current={provider}/>
<SetValues {provider} bind:values bind:ready/>

<div class="row-flex" transition:slide>
    <button on:click={finalize} disabled={!ready}>Готово</button>
    <button on:click={back}>Отмена</button>
</div>

<style>
    .debug {
        bottom : 0;
        left : 0;
    }
</style>
