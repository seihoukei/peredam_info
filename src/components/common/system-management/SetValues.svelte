<script>
    import ValueEdit from "components/common/system-management/ValueEdit.svelte"

    import {slide} from "svelte/transition"

    import library from "stores/library.js"
    import appState from "stores/app-state.js"

    import Values from "utility/values.js"

    export let setOnlyConstants = false

    export let input = {}
    export let isInputReady

    let valueReadiness = {}

    $: provider_id = $appState.provider_id
    $: provider = library.providers[provider_id] || null
    $: valuesToSet = provider?.values ?? {}
    $: resetInputOnChange(provider)

    $: appState.setData(Values.stringify(input))

    $: isInputReady = Object.values(valueReadiness).every(Boolean)

    function resetInputOnChange() {
        input = Values.parse($appState.data)
        valueReadiness = {}
    }

</script>

{#if provider !== null}
    <div class="centered flex">
        {#if !isInputReady}
            <div class="important large spacy-below" transition:slide>
                Заполните обязательные поля:
            </div>
        {/if}

        {#each Object.entries(valuesToSet) as [id, value], index}
            {#if value.constant || !setOnlyConstants}
                <ValueEdit description={value}
                           priority={index}
                           bind:value={input[id]}
                           bind:isValueReady={valueReadiness[id]} />

            {/if}

        {/each}

    </div>

{/if}
