<script>
    import SelectCity from "../../common/system-management/SelectCity.svelte"
    import SelectProvider from "../../common/system-management/SelectProvider.svelte"
    import SetValues from "../../common/system-management/SetValues.svelte"
    import {slide} from "svelte/transition"
    import Api from "../../../utility/api.js"
    import token from "../../../stores/token.js"
    import {createEventDispatcher} from "svelte"
    import status from "../../../stores/status.js"
    import Address from "../../../utility/address.js"
    import Values from "../../../utility/values.js"
    import library from "../../../stores/library.js"

    export let adding = true

    let city_id = localStorage.defaultCity ?? null
    let provider_id = null
    let values = {}

    let ready = false

    $: Address.set(`user`, `add`, city_id, provider_id)

    $: if (city_id === null)
        provider_id = null

    $: newSystem = {
        provider_id, values
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

        newSystem.values = Values.formatValues(library.providers[provider_id].values, newSystem.values)
        const result = await Api.addSystem($token, newSystem)

        if (!result.success) {
            status.error(result.error)

        } else {
            newSystem.id = result.data.id
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
