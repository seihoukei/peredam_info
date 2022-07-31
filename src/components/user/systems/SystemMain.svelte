<script>
    import library from "../../../stores/library.js"
    import {slide} from "svelte/transition"
    import StaticDetail from "../../common/system-management/StaticDetail.svelte"
    import VariableDetail from "../../common/system-management/VariableDetail.svelte"
    import SelectMethod from "../../common/select-method/methods/SelectMethod.svelte"
    import Period from "../../../utility/period.js"
    import Api from "../../../utility/api.js"
    import {createEventDispatcher} from "svelte"
    import modal from "../../../stores/modal.js"
    import Values from "../../../utility/values.js"
    import Address from "../../../utility/address.js"
    import appState from "../../../stores/app-state.js"

    export let system = {}

    let input = Values.inputTemplate()
    let editorValues = {}
    let manual = Api.isManualByDefault
    let container

    $: system_id = $appState.system_id
    $: mode = $appState.mode

    $: provider = library.providers[system?.provider_id] ?? null
    $: resetProvider(provider)

    $: onlineMethodAvailable = provider?.onlineMethod || provider?.usesStoreMethod

    $: period = new Period(provider?.period)
    $: ready = validate(values, editorValues)
    $: offline = !onlineMethodAvailable || manual

    $: values = Values.formatValues(provider?.values, {
        ...system?.values,
        ...input,
    })

    $: appState.setData(Address.stringify(input))

    const dispatch = createEventDispatcher()

    function resetProvider() {
        resetInput()
        manual = Api.isManualByDefault
    }

    function resetInput() {
        input = Object.entries(provider?.values ?? {})
            .filter(([key, value]) => !value.constant)
            .reduce((output, [key, value]) => ({
                ...output,
                [key]: "",
            }), {})
        Object.assign(input, Values.inputTemplate($appState.data))
    }

    function setManual() {
        manual = true
    }

    function startSending() {
        const data = period.analyze(system.last?.date)
        const outsidePeriod = !data.inside
        const alreadySubmitted = data.recent

        let confirmation = null

        if (outsidePeriod) {
            confirmation = `Поставщик рекомендует отправлять показания в период ${period.toString()}. Показания, отправленные сейчас, могут быть не приняты!`
        }

        if (alreadySubmitted) {
            confirmation = `Вы уже передавали показания в этом периоде (${Period.dayMonthString(system.last.date)}).`
        }

        if (confirmation !== null) {
            modal.notify(confirmation,
                [
                    {
                        text: "Всё равно передать",
                        callback: () => appState.setMode(`send`),
                    }, {
                    text: "Отмена",
                    callback: null,
                },
                ])
        } else {
            appState.setMode(`send`)
        }

        (() => appState.setMode(`send`))
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
        modal.notify("После удаления систему невозможно восстановить!", [
            {
                text: "Всё равно удалить",
                callback: () => remove(),
            }, {
                text: "Отмена",
                callback: null,
            },
        ])
    }

    async function remove() {
        const result = await modal.await(
            Api.removeSystem($appState.token, system.id),
            "Удаление данных...",
        )

        if (result.success) {
            dispatch("remove", system.id)
            input = {}
            system = null
            appState.setMode(``)

        } else {
            modal.error(result.error)

        }
    }

    async function saveEdit() {
        editorValues = Values.formatValues(provider.values, editorValues)

        const result = await modal.await(
            Api.updateSystem($appState.token, system.id, editorValues),
            "Обновление данных...",
        )

        if (result.success) {
            system.values = editorValues
            appState.setMode(``)

        } else {
            modal.error(result.error)

        }

    }

    function validate() {
        let valuesToValidate = values
        let valuesToCheckAgainst = Object.entries(provider?.values ?? [])

        if (mode === `edit`) {
            valuesToValidate = Values.formatValues(provider?.values, editorValues)
            valuesToCheckAgainst = valuesToCheckAgainst.filter(x => x[1].constant)
        }

        if (!valuesToValidate || !valuesToCheckAgainst) {
            return false
        }

        return valuesToCheckAgainst.every(([id, value]) => {
            return valuesToValidate[id] !== null ||
                !value.mandatory && valuesToValidate[id] === ""
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
        const result = await modal.await(
            Api.submitUserValues($appState.token, system, values, true),
            "Передача показаний...",
        )

        if (result.success) {
            finalize()

        } else {
            modal.error("Не удалось передать данные, используйте ручные методы или попробуйте позже.")
            manual = true

        }
    }

    async function reportSubmission() {
        const result = await modal.await(
            Api.submitUserValues($appState.token, system, values),
            "Сохранение данных...",
        )

        if (result.success) {
            finalize()

        } else {
            modal.error("Не удалось сохранить данные. Это не страшно, если вы передали данные вручную.")

        }
    }

    function back() {
        appState.setSystemId(null)
    }

</script>

{#if system_id !== null && system !== null}
    {#if provider !== null}
        <div class="flex" bind:this={container}>
            {#if mode !== `send`}
                <StaticDetail name="Поставщик" value={provider?.name}/>
            {/if}
            {#each Object.entries(provider.values) as [id, value], index (id)}
                {#if value.constant}
                    {#if mode === `edit`}
                        <VariableDetail name={value.name} bind:value={editorValues[id]} type={value.type}
                                        priority={index}/>
                    {:else}
                        <StaticDetail name={value.name} value={system.values[id]}/>
                    {/if}
                {:else if mode === `send`}
                    <VariableDetail name={value.name} bind:value={input[id]} old={system.last?.values[id]}
                                    type={value.type} priority={index}/>
                {/if}
            {/each}
        </div>
        {#if mode === `edit`}
            <div class="row-flex spacy-below" transition:slide>
                <button on:click={saveEdit} disabled={$modal.waiting || !ready}>Сохранить</button>
                <button on:click={startRemoving} disabled={$modal.waiting}>Удалить</button>
                <button on:click={stopEditing}>◀ Отмена</button>
            </div>
        {:else if mode === `send`}
            {#if !ready}
                <div class="large important center-text spacy-below" transition:slide>
                    Заполните поля для показаний выше
                </div>
            {/if}
            {#if ready && offline}
                {#if Api.isManualByDefault}
                    <span class="spacy-below" transition:slide> Пока что доступна только отправка вручную.</span>
                {/if}
                <SelectMethod {values} methods={provider.methods}/>
                <span class="spacy-below" transition:slide>После успешной передачи показаний нажмите "Сохранить".</span>
            {/if}
            <div class="row-flex spacy-below" transition:slide>
                {#if !offline}
                    <button on:click={submitOnline} disabled={!ready || $modal.waiting}>Отправить</button>
                    <button on:click={setManual} disabled={!ready || $modal.waiting}>Вручную</button>
                {:else}
                    <button on:click={reportSubmission} disabled={!ready || $modal.waiting}>Сохранить</button>
                {/if}
                <button on:click={stopSending}>◀ Отмена</button>
            </div>
        {:else}
            <div class="row-flex spacy-below" transition:slide>
                <button on:click={startSending}>Передать</button>
                <button on:click={startEditing}>Изменить</button>
                <button on:click={back}>◀ Назад</button>
            </div>
        {/if}

    {:else}
        <span class="error" transition:slide>Неизвестный поставщик услуг</span>

    {/if}

{/if}
