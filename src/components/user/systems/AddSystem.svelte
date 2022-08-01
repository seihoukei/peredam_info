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
    import Values from "utility/values.js"

    const dispatch = createEventDispatcher()
    // add (newSystem) - to notify userMain that system was succesfully added and should be displayed

    let input = {}
    let isInputReady = false

    $: provider_id = $appState.provider_id
    $: page = $appState.page

    $: provider = library.providers[provider_id] ?? null

    $: canSend = isInputReady || $modal.waiting

    $: newSystem = {
        provider_id,
        values : Values.formatValues(provider?.values, input),
    }

    async function finalize() {
        const result = await modal.await(
            Api.addSystem($appState.token, newSystem),
            "Добавление данных",
        )

        if (result.success) {
            modal.success("Данные добавлены!")
            newSystem.id = result.data.id
            dispatch("add", newSystem)

        } else {
            modal.error(result.error)

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
    <SetValues bind:input bind:isInputReady setOnlyConstants="true"/>

    <div class="spacy-below row-flex" transition:slide>
        <button on:click={finalize}
                disabled={!canSend}>Добавить</button>

        <button on:click={back}>◀ Назад</button>

    </div>

{/if}
