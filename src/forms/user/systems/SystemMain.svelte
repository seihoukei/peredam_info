<script>
    import library from "../../../stores/library.js"
    import {slide} from "svelte/transition"
    import StaticDetail from "../../common/system-management/StaticDetail.svelte"
    import VariableDetail from "../../common/system-management/VariableDetail.svelte"
    import SelectMethod from "../../common/select-method/methods/SelectMethod.svelte"
    import Period from "../../../utility/period.js"
    import formatValue from "../../../utility/format-value.js"
    import Api from "../../../utility/api.js"
    import token from "../../../stores/token.js"
    import {createEventDispatcher} from "svelte"
    import status from "../../../stores/status.js"

    export let system = {}
    export let offline = false

    let input = {}
    let editing = false
    let editorValues = {}
    let sending = false
    let removing = false
    let manual = true

    $: provider = getProvider(system)
    $: period = new Period(provider?.period)
    $: ready = validate(input)
    $: offline = !provider?.providerData?.onlineMethod && !provider?.providerData?.store || manual


    $: values = {
        ...system?.values,
        ...input,
    }

    const dispatch = createEventDispatcher()

    function getProvider(system) {
        input = {}
        sending = false
        editing = false
        manual = true

        if (system === null)
            return null

        return library.providers[system.provider_id] ?? null
    }

    function setManual() {
        manual = true
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
        status.startWaiting("Удаление данных...")
        const result = await Api.removeSystem($token, system.id)

        if (result.success) {
            dispatch("remove", system.id)
            input = {}
            system = null
            sending = false
            editing = false
            removing = false

        } else {
            status.error(result.error)

        }

        status.stopWaiting()
    }

    async function saveEdit() {
        status.startWaiting("Обновление данных...")

        const result = await Api.updateSystem($token, system.id, editorValues)

        if (result.success) {
            system.values = editorValues
            editing = false

        } else {
            status.error(result.error)

        }

        status.stopWaiting()
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
    }

    async function submitOnline() {
        status.startWaiting("Передача показаний...")

        const result = await Api.submitUserValues($token, system, values, true)

        if (result.success) {
            finalize()

        } else {
            status.error("Не удалось передать данные, используйте ручные методы или попробуйте позже.")
            manual = true

        }
        status.stopWaiting()
    }

    async function reportSubmission() {
        status.startWaiting("Сохранение данных...")

        const result = await Api.submitUserValues($token, system, values)

        if (result.success) {
            finalize()

        } else {
            status.error("Не удалось сохранить данные. Это не страшно, если вы передали данные вручную.")

        }
        status.stopWaiting()
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
                        <VariableDetail name={value.name} bind:value={editorValues[id]} type={value.type} />
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
                <button on:click={saveEdit} disabled={$status.waiting}>Сохранить</button>
                <button on:click={startRemoving} disabled={$status.waiting}>Удалить</button>
                <button on:click={stopEditing}>Отмена</button>
            </div>
        {:else if sending}
            {#if !ready}
                <div class="large important center-text spacy-below" transition:slide>
                    Заполните поля для показаний выше
                </div>
            {/if}
            {#if ready && offline}
                <SelectMethod {values} methods={provider.methods}/>
                <span class="spacy-below">После успешной передачи показаний нажмите "Сохранить".</span>
            {/if}
            <div class="row-flex spacy-below" transition:slide>
                {#if !offline}
                    <button on:click={submitOnline} disabled={!ready || $status.waiting}>Отправить</button>
                    <button on:click={setManual} disabled={!ready || $status.waiting}>Вручную</button>
                {:else}
                    <button on:click={reportSubmission}>Сохранить</button>
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
