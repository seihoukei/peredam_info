<script>
    import library from "../../../stores/library.js"
    import VariableDetail from "./VariableDetail.svelte"
    import { slide } from "svelte/transition"
    import Values from "../../../utility/values.js"
    import appState from "../../../stores/app-state.js"
    import Address from "../../../utility/address.js"

    $: provider_id = $appState.provider_id

    export let values = {}
    export let ready
    export let all = false

    $: provider = library.providers[provider_id] || null
    $: valuesToFill = getValuesToFill(provider)
    $: ready = validate(valuesToFill, values)

    function getValuesToFill(provider) {
        const result = []
        if (provider === null)
            return result

        for (const [id, value] of Object.entries(provider.values))
            if (value.constant || all)
                result.push({
                    name : value.name,
                    type : value.type,
                    mandatory : value.mandatory,
                    id,
                })
        return result
    }

    function validate() {
        if (provider === null)
            return false
        return valuesToFill.every(value => {
            return Values.formatValue(value.type, values[value.id]) !== null || !value.mandatory && values[value.id] === ""
        })
    }
</script>

{#if provider !== null}
    <div class="centered flex">
        <div class="important large spacy-below" transition:slide>Заполните обязательные поля:</div>
        {#each valuesToFill as value, index}
            <VariableDetail name={value.name} type={value.type} bind:value={values[value.id]} priority={index} />
        {/each}
    </div>
{/if}
