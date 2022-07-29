<script>
    import SelectCity from "../../common/system-management/SelectCity.svelte"
    import SelectProvider from "../../common/system-management/SelectProvider.svelte"
    import SetValues from "../../common/system-management/SetValues.svelte"
    import {slide} from "svelte/transition"
    import Api from "../../../utility/api.js"
    import {createEventDispatcher} from "svelte"
    import modal from "../../../stores/modal.js"
    import Values from "../../../utility/values.js"
    import library from "../../../stores/library.js"
    import appState from "../../../stores/app-state.js"
    import Address from "../../../utility/address.js"

    let ready = false

    $: provider_id = $appState.provider_id
    $: page = $appState.page

    $: values = inputTemplate(provider_id)
    $: appState.setData(Address.stringify(values))

    $: newSystem = {
        provider_id, values
    }

    const dispatch = createEventDispatcher()

    function back() {
        if (provider_id)
            appState.setProviderId(null)
        else
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
        newSystem.values = Values.formatValues(library.providers[provider_id].values, newSystem.values)

        const result = await modal.await(
            Api.addSystem($appState.token, newSystem),
            "Добавление данных",
        )

        if (!result.success) {
            modal.error(result.error)

        } else {
            newSystem.id = result.data.id
            dispatch("add", newSystem)
        }
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug bottom">Добавление системы{JSON.stringify(newSystem, null, 1)}</pre>
{/if}

{#if page === 'add'}
    <SelectCity />
    <SelectProvider />
    <SetValues bind:values bind:ready/>

    <div class="spacy-below row-flex" transition:slide>
        <button on:click={finalize} disabled={!ready || $modal.waiting}>Добавить</button>
        <button on:click={back}>◀ Назад</button>
    </div>
{/if}
