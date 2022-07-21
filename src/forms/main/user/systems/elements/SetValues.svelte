<script>
    import library from "../../../../../stores/library.js"
    import {slide} from "svelte/transition"

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
    <div class="entry" transition:slide>
        <span class="value-name">Период:</span>
        <span class="value">{providerInfo.period}</span>
    </div>
    {#each valuesToFill as value}
            <div class="entry" transition:slide>
                <span class="value-name">{value.name}</span>
                <input placeholder={value.type} bind:value={values[value.id]} />
            </div>
    {/each}
</div>
{/if}

<style>
    div.entry {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    span.value-name {
        font-size: var(--2u);
        text-align: center;
    }
    span.value {
        font-size: var(--2_5u);
        margin : 0 0 var(--2u);
    }
    input {
        margin : 0 0 var(--2u);
    }
</style>
