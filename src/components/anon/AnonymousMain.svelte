<script>
    import TopLogo from "components/common/TopLogo.svelte"
    import SelectCity from "components/common/system-management/SelectCity.svelte"
    import SelectProvider from "components/common/system-management/SelectProvider.svelte"
    import SetValues from "components/common/system-management/SetValues.svelte"
    import SelectMethod from "components/common/select-method/methods/SelectMethod.svelte"

    import {fade, fly, slide} from "svelte/transition"

    import library from "stores/library.js"
    import modal from "stores/modal.js"
    import appState from "stores/app-state.js"

    import Api from "utility/api.js"
    import Values from "utility/values.js"
    import Transitions from "utility/transitions.js"

    let input = {}

    let isInputReady = false
    let choseManualMethod = Api.forceManualMethod
    let agreed = false

    $: provider_id = $appState.provider_id

    $: provider = library.providers[provider_id] ?? null
    $: resetOnChange(provider)

    $: valuesToSubmit = Values.formatValues(provider?.values, input)

    $: onlineMethodAvailable = provider?.onlineMethod || provider?.usesStoreMethod
    $: useManualMethods = !onlineMethodAvailable || choseManualMethod

    $: canSend = isInputReady && !$modal.waiting
    $: canAutoSend = canSend && agreed

    function resetOnChange() {
        choseManualMethod = Api.forceManualMethod
    }

    function chooseManualMethod() {
        choseManualMethod = true
    }

    async function submit() {
        const result = await modal.await(
            Api.submitAnonymousValues(provider_id, valuesToSubmit, true),
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

    function finalize() {
        appState.setProviderId(null)
    }

    function back() {
        if (provider_id) {
            appState.setProviderId(null)
        } else {
            appState.setPage("")
        }
    }

</script>

<div class="top-central centered wrapper flex" in:fade out:fly={Transitions.dialogFlyUp}>
    <TopLogo/>

    <SelectCity/>
    <SelectProvider/>
    <SetValues bind:isInputReady bind:input/>

    {#if !isInputReady && provider !== null}
        <div class="large important center-text spacy-below" transition:slide>
            Заполните поля для показаний выше
        </div>
    {/if}

    {#if isInputReady && useManualMethods && provider !== null}
        {#if Api.forceManualMethod}
            <span class="center-text spacy-below" transition:slide>
                Пока что доступна только отправка вручную.
            </span>

        {:else if !onlineMethodAvailable}
            <span class="center-text spacy-below" transition:slide>
                Для данного поставщика услуг доступна только отправка вручную.
            </span>

        {/if}

        <SelectMethod valuesToSend={input} methods={provider.methods}/>
    {/if}
    {#if !useManualMethods && provider_id !== null}
        <div class="centered spacy-below center-text flex">
            <label>
                <input bind:checked={agreed} type="checkbox"/>
                Я даю согласие на обработку моих персональных данных
                (<a href="/agreement/personal.html"
                    rel="noopener noreferrer"
                    target="_blank" >Подробнее</a>)
            </label>
        </div>

    {/if}

    <div class="row-flex spacy-below" transition:slide>
        {#if !useManualMethods}
            <button on:click={submit}
                    disabled={!canAutoSend}>Отправить</button>

            <button on:click={chooseManualMethod}
                    disabled={!canSend}>Вручную</button>

        {:else if provider !== null}
            <button on:click={finalize}
                    disabled={!canSend}>Готово</button>

        {/if}

        <button on:click={back}>◀ Назад</button>

    </div>

</div>
