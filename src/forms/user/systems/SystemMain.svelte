<script>
    import library from "../../../stores/library.js"
    import {slide} from "svelte/transition"
    import StaticDetail from "./elements/StaticDetail.svelte"
    import VariableDetail from "./elements/VariableDetail.svelte"
    import SelectMethod from "./elements/SelectMethod.svelte"
    import Period from "../../../utility/period.js"
    import formatValue from "../../../utility/format-value.js"
    import Api from "../../../utility/api.js"
    import fillTemplate from "../../../utility/template.js"

    export let system = {}
    export let offline = true

    let input = {}
    let editing = false
    let editorValues = {}
    let sending = false
    let submitting = false

    $: provider = getProvider(system)
    $: period = new Period(provider?.period)
    $: ready = validate(input)

    $: values = {
        ...system?.values,
        ...input,
    }

    function getProvider(system) {
        input = {}
        sending = false
        editing = false

        if (system === null)
            return null

        return library.providers[system.provider] ?? null
    }

    function startSending()  {
        sending = true
    }

    function startEditing() {
        editorValues = {...system.values}
        editing = true
    }

    function stopSending() {
        sending = false
    }

    function stopEditing() {
        editing = false
    }

    function saveEdit() {
        system.values = editorValues
        editing = false

        //syncUser()
    }

    function validate() {
        return Object.entries(input).every(([id,value]) => {
            return formatValue(provider.values[id].type, value) !== null || !provider.values[id].mandatory && value === ""
        })
    }

    function finalize() {
        system.last = {
            date: Date.now(),
            values: input,
        }

        input = {}
        system = null
        sending = false
        editing = false

        //syncUser()
    }

    async function submitOnline() {
        submitting = true
        await Api.submitData({
            system : system.id,
            data : fillTemplate(provider.onlineTemplate, {
                ...system.values,
                ...input
            }),
        })

        submitting = false

        finalize()
    }

</script>

{#if system !== null}
    {#if provider !== null}
        <div class="system">
            {#if !sending}
                <StaticDetail name="Поставщик" value={provider.name} />
                <StaticDetail name="Период" value={period?.toString()} />
            {/if}
            {#each Object.entries(provider.values) as [id, value] (id)}
                {#if value.constant}
                    {#if editing}
                        <VariableDetail name={value.name} bind:value={editorValues[id]} />
                    {:else}
                        <StaticDetail name={value.name} value={system.values[id]} />
                    {/if}
                {:else if sending}
                    <VariableDetail name={value.name} bind:value={input[id]} old={system.last?.values[id]} type={value.type}/>
                {/if}
            {/each}
        </div>
        {#if editing}
            <div class="row-flex spacy-below" transition:slide>
                <button on:click={saveEdit}>Сохранить</button>
                <button on:click={stopEditing}>Отмена</button>
            </div>
        {:else if sending}
            {#if !ready}
                <div class="large important center-text spacy-below" transition:slide>
                    Заполните поля для показаний выше
                </div>
            {/if}
            {#if ready && offline}
                <SelectMethod {values} methods={provider.methods} on:click={finalize}/>
            {/if}
            <div class="row-flex spacy-below" transition:slide>
                {#if !offline}
                    <button on:click={submitOnline} disabled={!ready || submitting}>Отправить</button>
                {/if}
                <button on:click={stopSending}>Отмена</button>
            </div>
        {:else}
            <div class="row-flex spacy-below" transition:slide>
                <button on:click={startEditing}>Изменить</button>
                <button on:click={startSending}>Передать</button>
            </div>
        {/if}
    {:else}
        <span class="error" transition:slide>Неизвестный поставщик услуг</span>
    {/if}
{/if}
