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
    import token from "../../../stores/token.js"
    import {createEventDispatcher} from "svelte"

    export let system = {}
    export let offline = true

    let input = {}
    let editing = false
    let editorValues = {}
    let sending = false
    let waiting = false
    let removing = false
    let status = ""

    $: provider = getProvider(system)
    $: period = new Period(provider?.period)
    $: ready = validate(input)

    $: values = {
        ...system?.values,
        ...input,
    }

    const dispatch = createEventDispatcher()

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

    function startRemoving() {
        removing = true
        remove() //TODO: confirmation instead
    }

    async function remove() {
        waiting = true
        status = "Обновление данных..."
        const result = await Api.removeSystem($token, system.id)

        if (result.success) {
            dispatch("remove", system.id)
            input = {}
            system = null
            sending = false
            editing = false
            removing = false

        } else {
            status = result.error

        }

        waiting = false
        status = ""
    }

    async function saveEdit() {
        waiting = true
        status = "Обновление данных..."
        const result = await Api.updateSystem($token, system.id, editorValues)

        if (result.success) {
            system.values = editorValues
            editing = false
        } else {
            status = result.error
        }
        waiting = false

        //syncUser()
    }

    function validate() {
        return Object.entries(input).every(([id,value]) => {
            return formatValue(provider.values[id].type, value) !== null || !provider.values[id].mandatory && value === ""
        })
    }

    async function finalize() {
        //TODO: update submit flow
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
        waiting = true

        const result = await Api.submitUserValues($token, system, values)

        if (result.success) {
            finalize()

        } else {
            //TODO : force offline
            console.log(result.error)
        }
        waiting = false

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
                <button on:click={saveEdit} disabled={waiting}>Сохранить</button>
                <button on:click={startRemoving} disabled={waiting}>Удалить</button>
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
                    <button on:click={submitOnline} disabled={!ready || waiting}>Отправить</button>
                {/if}
                <button on:click={stopSending}>Отмена</button>
            </div>
        {:else}
            <div class="row-flex spacy-below" transition:slide>
                <button on:click={startEditing}>Изменить</button>
                <button on:click={startSending}>Передать</button>
            </div>
        {/if}
        <span class="font-high spacy-below" transition:slide>{status}</span>
    {:else}
        <span class="error" transition:slide>Неизвестный поставщик услуг</span>
    {/if}
{/if}
