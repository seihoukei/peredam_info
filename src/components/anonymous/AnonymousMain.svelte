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
    import Address from "utility/address.js"
    import Transitions from "utility/transitions.js"

    let input = Values.inputTemplate()

    let isInputReady = false
    let isManualMethod = Api.isManualByDefault

    $: provider_id = $appState.provider_id

    $: provider = library.providers[provider_id] ?? null
    $: resetProvider(provider)


    $: appState.setData(Address.stringify(input))

    $: onlineMethodAvailable = provider?.onlineMethod || provider?.usesStoreMethod
    $: offline = !onlineMethodAvailable || isManualMethod
    $: canSend = isInputReady && !$modal.waiting

    function resetProvider() {
        resetInput()
        isManualMethod = Api.isManualByDefault
    }

    function setManual() {
        isManualMethod = true
    }

    function resetInput() {
        input = Object.keys(provider?.values ?? {})
            .reduce((output, key) => ({
                ...output,
                [key]: "",
            }), {})
        Object.assign(input, Values.inputTemplate($appState.data))
    }

    async function submitOnline() {
        const submitValues = Values.formatValues(provider.values, input)

        const result = await modal.await(
            Api.submitAnonymousValues(provider_id, submitValues, true),
            "Передача показаний...",
        )

        if (result.success) {
            finalize()

        } else {
            modal.error("Не удалось передать данные, используйте ручные методы или попробуйте позже.")
            isManualMethod = true

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
    <SetValues all="true" bind:ready={isInputReady} bind:values={input}/>

    {#if !isInputReady && provider !== null}
        <div class="large important center-text spacy-below" transition:slide>
            Заполните поля для показаний выше
        </div>
    {/if}

    {#if isInputReady && offline && provider !== null}
        {#if Api.isManualByDefault}
            <span class="spacy-below" transition:slide> Пока что доступна только отправка вручную.</span>
        {/if}

        <SelectMethod values={input} methods={provider.methods}/>
    {/if}

    <div class="row-flex spacy-below" transition:slide>
        {#if !offline}
            <button on:click={submitOnline} disabled={!canSend}>Отправить</button>
            <button on:click={setManual} disabled={!canSend}>Вручную</button>

        {:else if provider !== null}
            <button on:click={finalize} disabled={!canSend}>Готово</button>

        {/if}

        <button on:click={back}>◀ Назад</button>

    </div>

</div>
