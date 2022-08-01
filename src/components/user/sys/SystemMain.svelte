<script>
    import ValueDisplay from "components/common/system-management/ValueDisplay.svelte"
    import ValueEdit from "components/common/system-management/ValueEdit.svelte"
    import SelectMethod from "components/common/select-method/methods/SelectMethod.svelte"

    import {createEventDispatcher} from "svelte"
    import {slide} from "svelte/transition"

    import library from "stores/library.js"
    import modal from "stores/modal.js"
    import appState from "stores/app-state.js"

    import Api from "utility/api.js"
    import Period from "utility/period.js"
    import Values from "utility/values.js"

    const dispatch = createEventDispatcher()
    // remove (id) - remove system

    export let system = {}

    let choseManualMethod = Api.forceManualMethod
    let input = {}
    let valueReadiness = {}

    $: system_id = $appState.system_id
    $: mode = $appState.mode

    $: provider = library.providers[system?.provider_id] ?? null
    $: onlineMethodAvailable = provider?.onlineMethod || provider?.usesStoreMethod
    $: period = new Period(provider?.period)
    $: resetOnChange(mode, provider)

    $: isInputReady = Object.values(valueReadiness).every(Boolean)
    $: canSend = isInputReady && !$modal.waiting

    $: useManualMethod = !onlineMethodAvailable || choseManualMethod

    $: valuesToSend = Values.formatValues(provider?.values, {
        ...system?.values,
        ...input,
    })

    $: appState.setData(Values.stringify(input))

    function resetOnChange() {
        choseManualMethod = Api.forceManualMethod

        if (mode === `edit`)
            input = {...system.values}
        else
            input = {}

        Object.assign(input, Values.parse($appState.data))

        valueReadiness = {}

        if (mode === `send`)
            checkPeriod()
    }

    function setSendingMode() {
        appState.setMode(`send`)
    }

    function setEditingMode() {
        appState.setMode(`edit`)
    }

    function cancel() {
        appState.setMode(``)
    }

    function checkPeriod() {
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
            modal.notify(confirmation, [{
                    text: "Всё равно передать",
                    keyCodes: [13, 32],
                    callback: null,
                }, {
                    text: "Отмена",
                    keyCodes: [27],
                    callback: cancel,
                }])
        }
    }

    function chooseManualMethod() {
        choseManualMethod = true
    }

    function confirmRemoval() {
        modal.notify("После удаления систему невозможно восстановить!", [
            {
                text: "Всё равно удалить",
                keyCodes: [13,32],
                callback: remove,
            }, {
                text: "Отмена",
                keyCodes: [27],
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
            modal.success("Данные удалены!")
            dispatch("remove", system.id)
            appState.setMode(``)

        } else {
            modal.error(result.error)

        }
    }

    async function saveEdit() {
        input = Values.formatValues(provider.values, input)

        const result = await modal.await(
            Api.updateSystem($appState.token, system.id, input),
            "Обновление данных...",
        )

        if (result.success) {
            modal.success("Данные обновлены!")
            system.values = input
            appState.setMode(``)

        } else {
            modal.error(result.error)

        }

    }

    async function submitOnline() {
        const result = await modal.await(
            Api.submitUserValues($appState.token, system, valuesToSend, true),
            "Передача показаний...",
        )

        if (result.success) {
            modal.success("Показания переданы!")
            finalize()

        } else {
            modal.error("Не удалось передать данные, используйте ручные методы или попробуйте позже.")
            choseManualMethod = true

        }
    }

    async function reportSubmission() {
        const result = await modal.await(
            Api.submitUserValues($appState.token, system, valuesToSend),
            "Сохранение данных...",
        )

        if (result.success) {
            modal.success("Данные сохранены!")
            finalize()

        } else {
            modal.error("Не удалось сохранить данные. Это не страшно, если вы передали данные вручную.")

        }
    }

    function finalize() {
        system.last = {
            date: Date.now(),
            values: input,
        }

        appState.setSystemId(null)
    }

    function back() {
        appState.setSystemId(null)
    }

</script>

{#if system_id !== null && system !== null}
    {#if mode === ``}
        <div class="large important spacy-below center-text" transition:slide>
            Проверьте данные и выберите действие
        </div>
    {:else if mode === `edit`}
        <div class="large important spacy-below center-text" transition:slide>
            Уточните данные или удалите систему
        </div>
    {/if}

    {#if provider !== null}
        <div class="flex">
            {#if mode !== `send`}
                <ValueDisplay name="Поставщик" value={provider?.name}/>
            {/if}

            {#each Object.entries(provider.values) as [id, value], index (id)}
                {#if value.constant}
                    {#if mode === `edit`}
                        <ValueEdit description={value}
                                   priority={index}
                                   bind:value={input[id]}
                                   bind:isValueReady={valueReadiness[id]}/>

                    {:else}
                        <ValueDisplay name={value.name}
                                      value={system.values[id]}/>

                    {/if}

                {:else if mode === `send`}
                    <ValueEdit description={value}
                               placeholder={system.last?.values[id]}
                               priority={index}
                               bind:value={input[id]}
                               bind:isValueReady={valueReadiness[id]}/>

                {/if}

            {/each}

        </div>

        {#if mode === `edit`}
            <div class="row-flex spacy-below" transition:slide>
                <button on:click={saveEdit}
                        disabled={!canSend}>Сохранить</button>

                <button on:click={confirmRemoval}
                        disabled={$modal.waiting}>Удалить</button>

                <button on:click={cancel}>◀ Отмена</button>
            </div>

        {:else if mode === `send`}
            {#if !isInputReady}
                <div class="large important center-text spacy-below" transition:slide>
                    Заполните поля для показаний выше
                </div>
            {/if}

            {#if isInputReady && useManualMethod}
                {#if Api.forceManualMethod}
                    <span class="center-text spacy-below" transition:slide>
                        Пока что доступна только отправка вручную.
                    </span>

                {:else if !onlineMethodAvailable}
                    <span class="center-text spacy-below" transition:slide>
                        Для данного поставщика услуг доступна только отправка вручную.
                    </span>

                {/if}

                <SelectMethod {valuesToSend} methods={provider.methods}/>

                <span class="center-text spacy-below" transition:slide>
                    После успешной передачи показаний нажмите "Сохранить".
                </span>

            {/if}

            <div class="row-flex spacy-below" transition:slide>
                {#if !useManualMethod}
                    <button on:click={submitOnline}
                            disabled={!canSend}>Отправить</button>

                    <button on:click={chooseManualMethod}
                            disabled={!canSend}>Вручную</button>

                {:else}
                    <button on:click={reportSubmission}
                            disabled={!canSend}>Сохранить</button>

                {/if}

                <button on:click={cancel}>◀ Отмена</button>

            </div>

        {:else}
            <div class="row-flex spacy-below" transition:slide>
                <button on:click={setSendingMode}>Передать</button>
                <button on:click={setEditingMode}>Изменить</button>
                <button on:click={back}>◀ Назад</button>

            </div>

        {/if}

    {:else}
        <span class="error" transition:slide>Неизвестный поставщик услуг</span>

    {/if}

{/if}
