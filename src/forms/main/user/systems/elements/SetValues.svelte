<script>
    import Api from "../../../../../utility/api.js"
    import {slide} from "svelte/transition"

    export let provider = null
    export let values = {}
    export let ready = false

    let valuesToFill = []

    const getProviderDescription = Api.getProviderDescription(provider).then(result => {
        valuesToFill = []
        if (result.success) {
            for (const [id, value] of Object.entries(result.data.values))
                if (value.constant && value.mandatory)
                    valuesToFill.push({
                        name : value.name,
                        type : value.type,
                        id,
                    })
        }
        return {
            period : result.data.period
        }
    })

    const validate = () => {
        return valuesToFill.every(value => {
            return values[value.id] !== undefined && values[value.id] !== ""
        })
    }

    $: ready = validate(valuesToFill, values)
</script>

<div class="list">
    {#await getProviderDescription}
        <span class="value-name" transition:slide>...получение информации о поставщике...</span>
    {:then result}
        <div class="entry" transition:slide>
            <span class="value-name">Период:</span>
            <span class="value">{result.period}</span>
        </div>
        {#each valuesToFill as value}
                <div class="entry" transition:slide>
                    <span class="value-name">{value.name}</span>
                    <input placeholder={value.type} bind:value={values[value.id]} />
                </div>
        {/each}
    {/await}
</div>

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
