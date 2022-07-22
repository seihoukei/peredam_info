<script>
    import SelectCity from "./elements/SelectCity.svelte"
    import SelectProvider from "./elements/SelectProvider.svelte"
    import SetValues from "./elements/SetValues.svelte"
    import {slide} from "svelte/transition"
    import syncUser from "../../../../utility/sync-user.js"

    export let adding = true
    export let systems = []

    const back = () => {
        adding = false
    }

    let city = null
    let provider = null
    let values = {}
    let ready = false

    $: settingCity = city === null
    $: settingProvider = !settingCity && provider === null
    $: settingValues = !settingProvider

    $: newSystem = {
        provider, values
    }

    const finalize = () => {
        systems = [...systems, {
            ...newSystem,
            name : "",
        }]
        adding = false

        //syncUser()
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Добавление системы{JSON.stringify(newSystem, null, 1)}</pre>
{/if}

<SelectCity bind:current={city} />
<SelectProvider {city} bind:current={provider}/>
<SetValues {provider} bind:values bind:ready/>

<div class="buttons" transition:slide>
    <button on:click={finalize} disabled={!ready}>Готово</button>
    <button on:click={back}>Отмена</button>
</div>

<style>
    .debug {
        color: var(--text-color);
        position: absolute;
        bottom : 0;
        left : 0;
        opacity: 0.2;
        font-size: 20px;
        pointer-events: none;
        z-index:100;
    }
</style>
