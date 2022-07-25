<script>
    import TopLogo from "../TopLogo.svelte"
    import SelectCity from "../user/systems/elements/SelectCity.svelte"
    import SelectProvider from "../user/systems/elements/SelectProvider.svelte"
    import SetValues from "../user/systems/elements/SetValues.svelte"
    import Api from "../../utility/api.js"
    import fillTemplate from "../../utility/template.js"
    import {slide, fly, fade} from "svelte/transition"
    import {dialogFlyUp} from "../../utility/transitions.js"
    import SelectMethod from "../user/systems/elements/SelectMethod.svelte"
    import library from "../../stores/library.js"

    export let anonymous = true

    let city = null
    let provider = null
    let values = {}
    let ready = false
    let offline = true
    let system = {
        values:{}
    }

    function getProviderInfo(provider) {
        values = {}

        if (provider === null)
            return null

        return library.providers[provider] ?? null
    }

    $: providerInfo = getProviderInfo(provider)

    let submitting = false

    const submitOnline = async () => {
        submitting = true

        await Api.submitAnonymousValues(provider, values)

        submitting = false

        finalize()
    }

    function finalize() {
        provider = null
    }

    function leave() {
        anonymous = false
    }
</script>

<div class="top-central centered wrapper flex" in:fade out:fly={dialogFlyUp}>
    <TopLogo />
    <SelectCity bind:current={city} />
    <SelectProvider {city} bind:current={provider}/>
    <SetValues {provider} bind:values bind:ready all="true" />

    {#if !ready && providerInfo !== null}
        <div class="large important center-text spacy-below" transition:slide>
            Заполните поля для показаний выше
        </div>
    {/if}

    {#if ready && offline && providerInfo !== null}
        <SelectMethod {values} methods={providerInfo.methods} on:click={finalize}/>
    {/if}
    <div class="row-flex spacy-below" transition:slide>
        {#if !offline}
            <button on:click={submitOnline} disabled={!ready || submitting}>Отправить</button>
        {/if}
        <button on:click={leave}>◀ Выход</button>
    </div>

</div>
