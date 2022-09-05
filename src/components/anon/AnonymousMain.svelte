<script>
    import TopLogo from "components/common/TopLogo.svelte"
    import SelectCity from "components/common/system-management/SelectCity.svelte"
    import SelectProvider from "components/common/system-management/SelectProvider.svelte"
    import SetValues from "components/common/system-management/SetValues.svelte"
    import SelectMethod from "components/common/select-method/methods/SelectMethod.svelte"

    import {slide} from "svelte/transition"

    import library from "stores/library.js"
    import apiStatus from "stores/api-status.js"
    import appState from "stores/app-state.js"
    import modal from "stores/modal.js"

    import Api from "utility/api.js"
    import Values from "utility/values.js"

    export let offline = false

    let input = {}

    let isInputReady = false
    let choseManualMethod = Api.forceManualMethod
    let agreed = false

    $: city_id = $appState.city_id
    $: provider_id = $appState.provider_id

    $: city = library.cities[city_id] ?? null
    $: provider = library.providers[provider_id] ?? null
    $: resetOnChange(provider)

    $: valuesToSubmit = Values.formatValues(provider?.values, input)

    $: onlineMethodAvailable = provider?.onlineMethod || provider?.usesStoreMethod
    $: useManualMethods = !onlineMethodAvailable || choseManualMethod || offline

    $: canSend = isInputReady && !$apiStatus.waiting
    $: canAutoSend = canSend && agreed

    function resetOnChange() {
        choseManualMethod = Api.forceManualMethod
    }

    function chooseManualMethod() {
        choseManualMethod = true
    }

    async function submit() {
        const result = await apiStatus.await(
            Api.submitAnonymousValues(provider_id, valuesToSubmit, true),
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

<div class="top-central centered wrapper flex">
    <TopLogo/>

    <div class="large center-text spacy-below row-flex">
        <button on:click={back}>◀</button>
        <span>Работа без регистрации</span>
    </div>

    <SelectCity>
        <SelectProvider {city}>
            <SetValues {provider} bind:input bind:isInputReady/>
        </SelectProvider>
    </SelectCity>

    {#if !isInputReady && provider !== null}
        <div class="large important center-text spacy-below" transition:slide|local>
            Заполните поля для показаний выше
        </div>
    {/if}

    {#if isInputReady && useManualMethods && provider !== null}
        {#if Api.forceManualMethod}
            <span class="center-text spacy-below" transition:slide|local>
                Пока что доступна только отправка вручную.
            </span>

        {:else if !onlineMethodAvailable}
            <span class="center-text spacy-below" transition:slide|local>
                Для данного поставщика услуг доступна только отправка вручную.
            </span>

        {/if}

        <SelectMethod valuesToSubmit={input} methods={provider.methods}/>
    {/if}

    {#if !useManualMethods && provider_id !== null}
        <div class="centered spacy-below center-text flex" transition:slide|local>
            <label>
                <input bind:checked={agreed} type="checkbox"/>
                Я даю согласие на обработку моих персональных данных
                (<a href="/agreement/personal.html"
                    rel="noopener noreferrer"
                    target="_blank" >Подробнее</a>)
            </label>
        </div>

    {/if}

    <div class="row-flex spacy-below" transition:slide|local>
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
