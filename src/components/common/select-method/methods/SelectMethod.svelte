<script>
    import EMailMethod from "components/common/select-method/methods/EMailMethod.svelte"
    import PhoneMethod from "components/common/select-method/methods/PhoneMethod.svelte"
    import SmsMethod from "components/common/select-method/methods/SmsMethod.svelte"
    import SiteMethod from "components/common/select-method/methods/SiteMethod.svelte"
    import MethodButton from "components/common/select-method/methods/MethodButton.svelte"

    import {slide} from "svelte/transition"

    const METHOD_COMPONENTS = {
        "E-MAIL": EMailMethod,
        "PHONE": PhoneMethod,
        "PHONE_AUTO": PhoneMethod,
        "SMS": SmsMethod,
        "SITE": SiteMethod,
    }

    export let valuesToSend
    export let methods

    let current = null

    function setMethod(method) {
        current = method
    }
</script>

<div class="centered spacy-below flex" transition:slide>
    {#if current === null}
        <div class="spacy-below large important center-text" transition:slide|local>
            Для отправки вручную выберите один из следующих способов:
        </div>
    {/if}

    <div class="spacy-below row-flex buttons">
        {#each methods as method}
            <MethodButton type={method.type} on:click={() => setMethod(method)}/>
        {/each}
    </div>

    {#if current !== null}
        {#key current}
            <svelte:component this={METHOD_COMPONENTS[current.type]} {valuesToSend} method={current}/>
        {/key}
    {/if}

</div>

<style>
    div.buttons {
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
