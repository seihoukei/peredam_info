<script>
    import ValueDisplay from "components/common/system-management/ValueDisplay.svelte"
    import ValueEdit from "components/common/system-management/ValueEdit.svelte"
    import SelectMethod from "components/common/select-method/methods/SelectMethod.svelte"

    import {createEventDispatcher} from "svelte"
    import {slide} from "svelte/transition"

    import library from "stores/library.js"
    import apiStatus from "stores/api-status.js"
    import appState from "stores/app-state.js"

    import Api from "utility/api.js"
    import Period from "utility/period.js"
    import Values from "utility/values.js"
    import modal from "stores/modal.js"
    import SystemHistory from "components/user/sys/SystemHistory.svelte"

    const dispatch = createEventDispatcher()
    // remove (id) - remove system

    export let system = {}
    export let offline = false

    let choseManualMethod = Api.forceManualMethod
    let input = {}
    let valueReadiness = {}

    $: page = $appState.page
    $: mode = $appState.mode

    $: provider = library.providers[system?.provider_id] ?? null
    $: onlineMethodAvailable = provider?.onlineMethod || provider?.usesStoreMethod
    $: period = new Period(provider?.period)
    $: resetOnChange(mode, provider)

    $: isInputReady = Object.values(valueReadiness).every(Boolean)
    $: canSend = isInputReady && !$apiStatus.waiting

    $: useManualMethod = !onlineMethodAvailable || choseManualMethod || offline

    $: valuesToSubmit = Values.formatValues(provider?.values, {
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

    function setHistoryMode() {
        appState.setMode(`history`)
    }

    function setEditingMode() {
        appState.setMode(`edit`)
    }

    function cancel() {
        appState.setMode(``, appState.UPDATE_ADDRESS.NO)
    }

    function checkPeriod() {
        const data = period.analyze(system.last?.date)
        const outsidePeriod = !data.inside
        const alreadySubmitted = data.recent

        let confirmation = null

        if (outsidePeriod) {
            confirmation = `Поставщик рекомендует отправлять показания в период \n ${period.toString()}. \nПоказания, отправленные сейчас, могут быть не приняты!`
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
                    back: true,
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
                back: true,
                callback: null,
            },
        ])
    }

    async function remove() {
        const result = await apiStatus.await(
            Api.removeSystem($appState.token, system.id),
            "Удаление данных...",
        )

        if (result.success) {
            apiStatus.success("Данные удалены!")
            dispatch("remove", system.id)
            appState.setMode(``)

        } else {
            apiStatus.error(result.error)

        }
    }

    async function saveEdit() {
        input = Values.formatValues(provider.values, input)

        const result = await apiStatus.await(
            Api.updateSystem($appState.token, system.id, input),
            "Обновление данных...",
        )

        if (result.success) {
            apiStatus.success("Данные обновлены!")
            system.values = input
            appState.setMode(``)

        } else {
            apiStatus.error(result.error)

        }

    }

    async function submitOnline() {
        const result = await apiStatus.await(
            Api.submitUserValues($appState.token, system, valuesToSubmit, true),
            "Передача показаний...",
        )

        if (result.success) {
            apiStatus.success("Показания переданы!")
            finalize()

        } else {
            modal.error("Не удалось передать данные, используйте ручные методы или попробуйте позже.")
            choseManualMethod = true

        }
    }

    async function reportSubmission() {
        const result = await apiStatus.await(
            Api.submitUserValues($appState.token, system, valuesToSubmit),
            "Сохранение данных...",
        )

        if (result.success) {
            apiStatus.success("Данные сохранены!")
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

<div class="centered flex">
    {#if system !== null}
        {#if mode === ``}
            <div class="large important spacy-below center-text" transition:slide|local>
                Проверьте данные и выберите действие
            </div>
        {:else if mode === `edit`}
            <div class="large important spacy-below center-text" transition:slide|local>
                Уточните данные или удалите систему
            </div>
        {/if}

        {#if provider !== null}

            {#if mode === `history`}
                <div transition:slide|local>
                    <SystemHistory {system} />

                </div>
            {:else}
                <div class="centered center-text flex" transition:slide|local>
                    {#if mode !== `send`}
                        <div transition:slide|local>
                            <ValueDisplay name="Поставщик" value={provider?.name}/>
                        </div>
                    {/if}

                    {#each Object.entries(provider.values) as [id, value], index (id)}
                        {#if value.constant}
                            {#if mode === `edit`}
                                <div transition:slide|local>
                                    <ValueEdit description={value}
                                               priority={index}
                                               bind:value={input[id]}
                                               bind:isValueReady={valueReadiness[id]}/>
                                </div>

                            {:else}
                                <div transition:slide|local>
                                    <ValueDisplay name={value.name}
                                                  value={system.values[id]}/>
                                </div>

                            {/if}

                        {:else}
                            {#if mode === `send`}
                                <div transition:slide|local>
                                    <ValueEdit description={value}
                                               placeholder={system.last?.values[id]}
                                               priority={index}
                                               bind:value={input[id]}
                                               bind:isValueReady={valueReadiness[id]}/>
                                </div>
                            {/if}

                        {/if}

                    {/each}

                    {#if mode === `send` && !isInputReady}
                        <div class="large important center-text spacy-below" transition:slide|local>
                            Заполните поля для показаний выше
                        </div>
                    {/if}
                </div>
            {/if}

            {#if mode === `send` && isInputReady && useManualMethod}
                {#if Api.forceManualMethod}
                    <span class="center-text spacy-below" transition:slide|local>
                        Пока что доступна только отправка вручную.
                    </span>

                {:else if !onlineMethodAvailable}
                    <span class="center-text spacy-below" transition:slide|local>
                        Для данного поставщика услуг доступна только отправка вручную.
                    </span>

                {/if}

                <SelectMethod {valuesToSubmit} methods={provider.methods}/>

                <span class="center-text spacy-below" transition:slide|local>
                    После успешной передачи показаний нажмите "Сохранить".
                </span>

            {/if}

            {#if mode === `edit`}
                <div class="row-flex spacy-below" transition:slide|local>
                    <button on:click={saveEdit}
                            disabled={!canSend || offline}>Сохранить</button>

                    <button on:click={confirmRemoval}
                            disabled={$apiStatus.waiting || offline}>Удалить</button>

                    <button on:click={cancel}>◀ Отмена</button>
                </div>

            {:else if mode === `send`}
                <div class="row-flex spacy-below" transition:slide|local>
                    {#if !useManualMethod}
                        <button on:click={submitOnline}
                                disabled={!canSend || offline}>Отправить</button>

                        <button on:click={chooseManualMethod}
                                disabled={!canSend}>Вручную</button>

                    {:else}
                        {#if offline}
                            <button on:click={back}
                                    disabled={!canSend}>Готово</button>
                        {:else}
                            <button on:click={reportSubmission}
                                    disabled={!canSend}>Сохранить</button>
                        {/if}

                    {/if}

                    <button on:click={cancel}>◀ Отмена</button>

                </div>

            {:else if mode === `history`}
                <div class="row-flex spacy-below" transition:slide|local>
                    <button on:click={cancel}>◀ Назад</button>

                </div>

            {:else}
                <div class="row-flex spacy-below" transition:slide|local>
                    <button on:click={setSendingMode}>Передать</button>
                    <button on:click={setHistoryMode}>История</button>
                    <button on:click={setEditingMode} disabled={offline}>✎</button>
                    <button on:click={back}>◀ Назад</button>

                </div>

            {/if}

        {:else}
            <span class="error" transition:slide|local>Неизвестный поставщик услуг</span>

        {/if}
    {/if}
</div>
