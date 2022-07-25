<script>
    import SelectCity from "./elements/SelectCity.svelte"
    import SelectProvider from "./elements/SelectProvider.svelte"
    import SetValues from "./elements/SetValues.svelte"
    import {slide} from "svelte/transition"
    import Api from "../../../utility/api.js"
    import token from "../../../stores/token.js"
    import {createEventDispatcher} from "svelte"

    export let adding = true
    export let systems = []

    let city = null
    let provider = null
    let values = {}
    let ready = false
    let waiting = false
    let status = ""

    $: if (city === null)
        provider = null

    $: newSystem = {
        provider, values
    }

    $: values = empty(provider)

    const dispatch = createEventDispatcher()

    const back = () => {
        adding = false
    }

    function empty() {
        return {}
    }

    async function finalize () {
        waiting = true
        status = "Добавляем систему..."

        const result = await Api.addSystem($token, newSystem)

        if (!result.success) {
            status = result.error
        } else {
            newSystem.id = result.data.id
            console.log(newSystem)
            dispatch("add", newSystem)
            adding = false
        }

        waiting = false
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Добавление системы{JSON.stringify(newSystem, null, 1)}</pre>
{/if}

<SelectCity bind:current={city} />
<SelectProvider {city} bind:current={provider}/>
<SetValues {provider} bind:values bind:ready/>

<div class="row-flex" transition:slide>
    <button on:click={finalize} disabled={!ready || waiting}>Добавить</button>
    <button on:click={back}>Отмена</button>
</div>
<span class="font-high spacy-below" transition:slide>{status}</span>

<style>
    .debug {
        bottom : 0;
        left : 0;
    }
</style>
