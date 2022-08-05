<script>
    import ValueEdit from "components/common/system-management/ValueEdit.svelte"

    import {slide} from "svelte/transition"

    import appState from "stores/app-state.js"

    import Values from "utility/values.js"

    export let setOnlyConstants = false

    export let provider = {}
    export let input = {}
    export let isInputReady

    let valueReadiness = {}

    $: valuesToSet = provider?.values ?? {}
    $: resetInputOnChange(provider)

    $: appState.setData(Values.stringify(input))

    $: isInputReady = Object.values(valueReadiness).every(Boolean)

    function resetInputOnChange() {
        input = Values.parse($appState.data)
        valueReadiness = {}

        for (let [key, value] of Object.entries(provider.values))
            if (value.constant || !setOnlyConstants)
                valueReadiness[key] = false
    }

</script>

<div class="centered flex">
    {#if provider !== null}
        {#if !isInputReady}
            <div class="important large center-text spacy-below" transition:slide|local>
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

    {/if}

</div>
