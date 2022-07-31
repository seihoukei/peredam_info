<script>
    import SelectCity from "components/common/system-management/SelectCity.svelte"
    import SelectProvider from "components/common/system-management/SelectProvider.svelte"
    import SetValues from "components/common/system-management/SetValues.svelte"

    import {createEventDispatcher} from "svelte"
    import {slide} from "svelte/transition"

    import modal from "stores/modal.js"
    import library from "stores/library.js"
    import appState from "stores/app-state.js"

    import Api from "utility/api.js"
    import Address from "utility/address.js"
    import Values from "utility/values.js"

    const dispatch = createEventDispatcher()
    // add (newSystem) - to notify userMain that system was succesfully added and should be displayed

    let inputReady = false

    $: provider_id = $appState.provider_id
    $: page = $appState.page

    $: values = inputTemplate(provider_id)
    $: appState.setData(Address.stringify(values))

    $: canSend = inputReady || $modal.waiting

    $: newSystem = {
        provider_id, values,
    }

    function inputTemplate() {
        const template = $appState.data
        if (template) {
            return Address.parse(template)
        }
        return {}
    }

    async function finalize() {
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

    function back() {
        if (provider_id) {
            appState.setProviderId(null)
        } else {
            appState.setPage("user")
        }
    }

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug bottom">Добавление системы{JSON.stringify(newSystem, null, 1)}</pre>
{/if}

{#if page === 'add'}
    <SelectCity/>
    <SelectProvider/>
    <SetValues bind:values bind:inputReady/>

    <div class="spacy-below row-flex" transition:slide>
        <button on:click={finalize} disabled={!canSend}>Добавить</button>
        <button on:click={back}>◀ Назад</button>
    </div>
{/if}
