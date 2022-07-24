<script>
    import library from "../../../../stores/library.js"
    import VariableDetail from "./VariableDetail.svelte"
    import formatValue from "../../../../utility/format-value.js"
    import { slide } from "svelte/transition"

    export let provider = null
    export let values = {}
    export let ready
    export let all = false

    $: providerInfo = library.providers[provider] || null
    $: valuesToFill = getValuesToFill(providerInfo)
    $: ready = validate(valuesToFill, values)

    function getValuesToFill(providerInfo) {
        const result = []
        if (providerInfo === null)
            return result

        for (const [id, value] of Object.entries(providerInfo.values))
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
        if (providerInfo === null)
            return false
        return valuesToFill.every(value => {
            return formatValue(value.type, values[value.id]) !== null || !value.mandatory && values[value.id] === ""
        })
    }
</script>

{#if providerInfo !== null}
    <div class="centered flex">
        <div class="important large spacy-below" transition:slide>Заполните обязательные поля:</div>
        {#each valuesToFill as value}
            <VariableDetail name={value.name} type={value.type} bind:value={values[value.id]} />
        {/each}
    </div>
{/if}
