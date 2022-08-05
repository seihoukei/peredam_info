<script>
    import SelectCity from "components/common/system-management/SelectCity.svelte"
    import SelectProvider from "components/common/system-management/SelectProvider.svelte"
    import SetValues from "components/common/system-management/SetValues.svelte"

    import {createEventDispatcher} from "svelte"

    import apiStatus from "stores/api-status.js"
    import library from "stores/library"
    import appState from "stores/app-state"

    import Api from "utility/api"
    import Values from "utility/values"

    const dispatch = createEventDispatcher()
    // add (newSystem) - to notify userMain that system was succesfully added and should be displayed

    let input = {}
    let isInputReady = false

    $: city_id = $appState.city_id
    $: provider_id = $appState.provider_id
    $: page = $appState.page

    $: city = library.cities[city_id] ?? null
    $: provider = library.providers[provider_id] ?? null

    $: canSend = isInputReady || $apiStatus.waiting

    $: newSystem = {
        provider_id,
        values : Values.formatValues(provider?.values, input),
    }

    async function finalize() {
        const result = await apiStatus.await(
            Api.addSystem($appState.token, newSystem),
            "Добавление данных",
        )

        if (result.success) {
            apiStatus.success("Данные добавлены!")
            newSystem.id = result.data.id
            dispatch("add", newSystem)

        } else {
            apiStatus.error(result.error)

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

<div class="centered flex">
    <SelectCity>
        <SelectProvider {city}>
            <SetValues {provider} bind:input bind:isInputReady setOnlyConstants="true"/>
        </SelectProvider>
    </SelectCity>

    <div class="spacy-below row-flex">
        <button on:click={finalize}
                disabled={!canSend}>Добавить</button>

        <button on:click={back}>◀ Назад</button>

    </div>

</div>
