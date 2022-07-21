<script>
    import library from "../../../../../stores/library.js"
    import {slide} from "svelte/transition"
    import StaticDetail from "./StaticDetail.svelte"
    import VariableDetail from "./VariableDetail.svelte"

    export let provider = null
    export let values = {}
    export let ready = false

    const getValuesToFill = (providerInfo) => {
        const result = []
        if (providerInfo === null)
            return result

        for (const [id, value] of Object.entries(providerInfo.values))
            if (value.constant)
                result.push({
                    name : value.name,
                    type : value.type,
                    mandatory : value.mandatory,
                    id,
                })
        return result
    }

    $: providerInfo = $library.providers[provider] || null
    $: valuesToFill = getValuesToFill(providerInfo)

    const validate = () => {
        return valuesToFill.every(value => {
            return values[value.id] !== undefined && values[value.id] !== ""
        })
    }

    $: ready = validate(valuesToFill, values)
</script>

{#if providerInfo !== null}
<div class="list">
    <StaticDetail name="Период:" value={providerInfo.period} />
    {#each valuesToFill as value}
        <VariableDetail name={value.name} type={value.type} bind:value={values[value.id]} />
    {/each}
</div>
{/if}

<style>
</style>
