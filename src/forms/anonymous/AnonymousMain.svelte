<script>
    import TopLogo from "../TopLogo.svelte"
    import SelectCity from "../user/systems/elements/SelectCity.svelte"
    import SelectProvider from "../user/systems/elements/SelectProvider.svelte"
    import SetValues from "../user/systems/elements/SetValues.svelte"
    import Api from "../../utility/api.js"
    import {slide, fly, fade} from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import SelectMethod from "../user/systems/elements/SelectMethod.svelte"
    import library from "../../stores/library.js"
    import status from "../../stores/status.js"


    export let anonymous = true

    let city_id = localStorage.defaultCity ?? null
    let provider_id = null
    let values = {}

    let ready = false
    let manual = false

    $: if (city_id === null)
        provider_id = null

    $: provider = getProviderInfo(provider_id)
    $: offline = !provider?.providerData?.onlineMethod && !provider?.providerData?.store || manual

    function setManual() {
        manual = true
    }

    function getProviderInfo(provider_id) {
        values = {}
        manual = false

        if (provider_id === null)
            return null

        return library.providers[provider_id] ?? null
    }

    async function submitOnline() {
        status.startWaiting("Передача показаний...")

        const result = await Api.submitAnonymousValues(provider_id, values, true)

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
        <SelectMethod {values} methods={provider.methods} on:click={finalize}/>
    {/if}
    <div class="row-flex spacy-below" transition:slide>
        {#if !offline}
            <button on:click={submitOnline} disabled={!ready || $status.waiting}>Отправить</button>
            <button on:click={setManual} disabled={!ready || $status.waiting}>Вручную</button>
        {/if}
        <button on:click={leave}>◀ Выход</button>
    </div>
</div>
