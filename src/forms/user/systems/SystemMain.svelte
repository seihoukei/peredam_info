<script>
    import library from "../../../stores/library.js"
    import {slide} from "svelte/transition"
    import StaticDetail from "../../common/system-management/StaticDetail.svelte"
    import VariableDetail from "../../common/system-management/VariableDetail.svelte"
    import SelectMethod from "../../common/select-method/methods/SelectMethod.svelte"
    import Period from "../../../utility/period.js"
    import Api from "../../../utility/api.js"
    import {createEventDispatcher} from "svelte"
    import status from "../../../stores/status.js"
    import Values from "../../../utility/values.js"
    import Address from "../../../utility/address.js"
    import appState from "../../../stores/app-state.js"

    const DEFAULT_MANUAL = Api.server === "https://api.peredam.info/"

    export let system = {}

    let input = inputTemplate()
    let editorValues = {}
    let removing = false
    let manual = DEFAULT_MANUAL

    $: provider = getProvider(system)
    $: period = new Period(provider?.period)
    $: ready = validate(input)
    $: offline = !provider?.providerData?.onlineMethod && !provider?.providerData?.store || manual

    $: values = Values.formatValues(provider?.values, {
        ...system?.values,
        ...input,
    })

    $: appState.setData(Address.stringify(input))

    const dispatch = createEventDispatcher()

    function getProvider(system) {
        input = {}
        manual = DEFAULT_MANUAL

        if (system === null)
            return null

        const provider = library.providers[system.provider_id] ?? null

        resetInput()
        Object.assign(input, inputTemplate())

        return provider
    }

    function inputTemplate() {
        const template = $appState.data
        if (template) {
            return Address.parse(template)
        }
        return {}
    }

    function resetInput() {
        input = Object.entries(provider?.values ?? {})
            .filter(([key, value]) => !value.constant)
            .reduce((output, [key, value]) => ({
                ... output,
                [key]: "",
            }), {})
    }

    function setManual() {
        manual = true
    }

    function startSending()  {
        appState.setMode(`send`)
    }

    function startEditing() {
        editorValues = {...system.values}
        appState.setMode(`edit`)
    }

    function stopSending() {
        appState.setMode(``)
    }

    function stopEditing() {
        appState.setMode(``)
    }

    function startRemoving() {
        removing = true
        remove() //TODO: confirmation instead
    }

    async function remove() {
        status.startWaiting("Удаление данных...")
        const result = await Api.removeSystem($appState.token, system.id)

        if (result.success) {
            dispatch("remove", system.id)
            input = {}
            system = null
            appState.setMode(``)
            removing = false

        } else {
            status.error(result.error)

        }

        status.stopWaiting()
    }

    async function saveEdit() {
        status.startWaiting("Обновление данных...")

        editorValues = Values.formatValues(provider.values,editorValues)

        const result = await Api.updateSystem($appState.token, system.id, editorValues)

        if (result.success) {
            system.values = editorValues
            appState.setMode(``)

        } else {
            status.error(result.error)

        }

        status.stopWaiting()
    }

    function validate() {
        if (!values || !provider?.values)
            return false
        return Object.entries(provider.values).every(([id,value]) => {
            return Values.formatValue(value.type, values[id]) !== null || !value.mandatory && values[id] === ""
        })
    }

    function finalize() {
        system.last = {
            date: Date.now(),
            values: input,
        }

        input = {}
        appState.setSystemId(null)
    }

    async function submitOnline() {
        status.startWaiting("Передача показаний...")

        const result = await Api.submitUserValues($appState.token, system, values, true)

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

        const result = await Api.submitUserValues($appState.token, system, values)

        if (result.success) {
            finalize()

        } else {
            status.error("Не удалось сохранить данные. Это не страшно, если вы передали данные вручную.")

        }
        status.stopWaiting()
    }

</script>

{#if (system?.id === $appState.system_id)}
    {#if system !== null}
        {#if provider !== null}
            <div class="flex">
                {#if $appState.mode !== `send`}
                    <StaticDetail name="Поставщик" value={provider?.name} />
                    <StaticDetail name="Период" value={period?.toString()} />
                {/if}
                {#each Object.entries(provider.values) as [id, value] (id)}
                    {#if value.constant}
                        {#if $appState.mode === `edit`}
                            <VariableDetail name={value.name} bind:value={editorValues[id]} type={value.type} />
                        {:else}
                            <StaticDetail name={value.name} value={system.values[id]} />
                        {/if}
                    {:else if $appState.mode === `send`}
                        <VariableDetail name={value.name} bind:value={input[id]} old={system.last?.values[id]} type={value.type}/>
                    {/if}
                {/each}
            </div>
            {#if $appState.mode === `edit`}
                <div class="row-flex spacy-below" transition:slide>
                    <button on:click={saveEdit} disabled={$status.waiting}>Сохранить</button>
                    <button on:click={startRemoving} disabled={$status.waiting}>Удалить</button>
                    <button on:click={stopEditing}>Отмена</button>
                </div>
            {:else if $appState.mode === `send`}
                {#if !ready}
                    <div class="large important center-text spacy-below" transition:slide>
                        Заполните поля для показаний выше
                    </div>
                {/if}
                {#if ready && offline}
                    {#if DEFAULT_MANUAL}
                        <span class="spacy-below" transition:slide> Пока что доступна только отправка вручную.</span>
                    {/if}
                    <SelectMethod {values} methods={provider.methods}/>
                    <span class="spacy-below" transition:slide>После успешной передачи показаний нажмите "Сохранить".</span>
                {/if}
                <div class="row-flex spacy-below" transition:slide>
                    {#if !offline}
                        <button on:click={submitOnline} disabled={!ready || $status.waiting}>Отправить</button>
                        <button on:click={setManual} disabled={!ready || $status.waiting}>Вручную</button>
                    {:else}
                        <button on:click={reportSubmission} disabled={!ready || $status.waiting}>Сохранить</button>
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

{/if}
