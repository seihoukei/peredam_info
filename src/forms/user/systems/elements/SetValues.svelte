<script>
    import library from "../../../../stores/library.js"
    import VariableDetail from "./VariableDetail.svelte"
    import formatValue from "../../../../utility/format-value.js"
    import { slide } from "svelte/transition"

    export let provider_id = null
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
            return formatValue(value.type, values[value.id]) !== null || !value.mandatory && values[value.id] === ""
        })
    }
</script>

{#if provider !== null}
    <div class="centered flex">
        <div class="important large spacy-below" transition:slide>Заполните обязательные поля:</div>
        {#each valuesToFill as value}
            <VariableDetail name={value.name} type={value.type} bind:value={values[value.id]} />
        {/each}
    </div>
{/if}
