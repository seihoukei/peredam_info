<script>
    import SelectCity from "../../common/system-management/SelectCity.svelte"
    import SelectProvider from "../../common/system-management/SelectProvider.svelte"
    import SetValues from "../../common/system-management/SetValues.svelte"
    import {slide} from "svelte/transition"
    import Api from "../../../utility/api.js"
    import {createEventDispatcher} from "svelte"
    import status from "../../../stores/status.js"
    import Values from "../../../utility/values.js"
    import library from "../../../stores/library.js"
    import appState from "../../../stores/app-state.js"
    import Address from "../../../utility/address.js"

    export let adding = true

    let ready = false

    $: provider_id = $appState.provider_id

    $: values = inputTemplate(provider_id)
    $: appState.setData(Address.stringify(values))

    $: newSystem = {
        provider_id, values
    }

    const dispatch = createEventDispatcher()

    const back = () => {
        appState.setPage("user")
    }

    function inputTemplate() {
        const template = $appState.data
        if (template) {
            return Address.parse(template)
        }
        return {}
    }

    async function finalize () {
        status.startWaiting("Добавление данных")

        newSystem.values = Values.formatValues(library.providers[provider_id].values, newSystem.values)
        const result = await Api.addSystem($appState.token, newSystem)

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

{#if $appState.page === 'add'}
    {#if import.meta.env.MODE === "development"}
        <pre class="debug">Добавление системы{JSON.stringify(newSystem, null, 1)}</pre>
    {/if}

    <SelectCity />
    <SelectProvider />
    <SetValues bind:values bind:ready/>

    <div class="spacy-below row-flex" transition:slide>
        <button on:click={finalize} disabled={!ready || $status.waiting}>Добавить</button>
        <button on:click={back}>Отмена</button>
    </div>
{/if}

<style>
    .debug {
        bottom : 0;
        left : 0;
    }
</style>
