<script>
    import SelectCity from "./elements/SelectCity.svelte"
    import SelectProvider from "./elements/SelectProvider.svelte"
    import SetValues from "./elements/SetValues.svelte"
    import {slide} from "svelte/transition"
    import Api from "../../../utility/api.js"
    import token from "../../../stores/token.js"
    import {createEventDispatcher} from "svelte"
    import status from "../../../stores/status.js"

    export let adding = true
    export let systems = []

    let city_id = localStorage.defaultCity ?? null
    let provider_id = null
    let values = {}

    let ready = false

    $: if (city_id === null)
        provider_id = null

    $: newSystem = {
        provider_id: provider_id, values
    }

    $: values = empty(provider_id)

    const dispatch = createEventDispatcher()

    const back = () => {
        adding = false
    }

    function empty() {
        return {}
    }

    async function finalize () {
        status.startWaiting("Добавление данных")

        const result = await Api.addSystem($token, newSystem)

        if (!result.success) {
            status.error(result.error)

        } else {
            newSystem.id = result.data.id
            console.log(newSystem)
            dispatch("add", newSystem)
            adding = false
        }

        status.stopWaiting()
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">Добавление системы{JSON.stringify(newSystem, null, 1)}</pre>
{/if}

<SelectCity bind:current={city_id} />
<SelectProvider {city_id} bind:current={provider_id}/>
<SetValues {provider_id} bind:values bind:ready/>

<div class="row-flex" transition:slide>
    <button on:click={finalize} disabled={!ready || $status.waiting}>Добавить</button>
    <button on:click={back}>Отмена</button>
</div>


<style>
    .debug {
        bottom : 0;
        left : 0;
    }
</style>
