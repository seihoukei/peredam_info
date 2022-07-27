<script>
    import TopLogo from "../common/TopLogo.svelte"
    import SelectCity from "../common/system-management/SelectCity.svelte"
    import SelectProvider from "../common/system-management/SelectProvider.svelte"
    import SetValues from "../common/system-management/SetValues.svelte"
    import Api from "../../utility/api.js"
    import {slide, fly, fade} from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import SelectMethod from "../common/select-method/methods/SelectMethod.svelte"
    import library from "../../stores/library.js"
    import status from "../../stores/status.js"
    import Address from "../../utility/address.js"
    import Values from "../../utility/values.js"

    const DEFAULT_MANUAL = true

    export let anonymous = true

    let city_id = localStorage.defaultCity ?? (+Address.getPart(1) || null)
    let provider_id = +Address.getPart(2) || null
    let values = inputTemplate()

    let ready = false
    let manual = DEFAULT_MANUAL

    $: if (city_id === null)
        provider_id = null

    $: Address.set(`anon`, city_id, provider_id, Address.stringify(values))

    $: provider = getProvider(provider_id)
    $: offline = !provider?.providerData?.onlineMethod && !provider?.providerData?.store || manual

    function setManual() {
        manual = true
    }

    function inputTemplate() {
        const template = Address.getPart(3, `anon`)
        if (template) {
            return Address.parse(template)
        }
        return {}
    }

    function resetInput() {
        values = Object.keys(provider?.values ?? {})
            .reduce((output, key) => ({
                ... output,
                [key]: "",
            }), {})
    }

    function getProvider(provider_id) {
        values = {}
        manual = DEFAULT_MANUAL

        const provider = library.providers[provider_id] ?? null

        resetInput()
        Object.assign(values, inputTemplate())

        return provider
    }

    async function submitOnline() {
        const submitValues = Values.formatValues(provider.values, values)

        status.startWaiting("Передача показаний...")

        const result = await Api.submitAnonymousValues(provider_id, submitValues, true)

        if (result.success) {
            finalize()

        } else {
            status.error("Не удалось передать данные, используйте ручные методы или попробуйте позже.")
            manual = true

        }
        status.stopWaiting()
    }

    function finalize() {
        provider_id = null
    }

    function leave() {
        anonymous = false
        Address.set()
    }
</script>

<div class="top-central centered wrapper flex" in:fade out:fly={dialogFlyUp}>
    <TopLogo />
    <SelectCity bind:current={city_id} />
    <SelectProvider {city_id} bind:current={provider_id}/>
    <SetValues {provider_id} bind:values bind:ready all="true" />

    {#if !ready && provider !== null}
        <div class="large important center-text spacy-below" transition:slide>
            Заполните поля для показаний выше
        </div>
    {/if}

    {#if ready && offline && provider !== null}
        {#if DEFAULT_MANUAL}
            <span class="spacy-below"> Пока что доступна только отправка вручную.</span>
        {/if}
        <SelectMethod {values} methods={provider.methods} />
    {/if}
    <div class="row-flex spacy-below" transition:slide>
        {#if !offline}
            <button on:click={submitOnline} disabled={!ready || $status.waiting}>Отправить</button>
            <button on:click={setManual} disabled={!ready || $status.waiting}>Вручную</button>
        {:else if provider !== null}
            <button on:click={finalize} disabled={!ready || $status.waiting}>Готово</button>
        {/if}
        <button on:click={leave}>◀ Выход</button>
    </div>
</div>
