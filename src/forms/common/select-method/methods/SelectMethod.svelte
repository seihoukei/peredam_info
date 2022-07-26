<script>
    import EMailMethod from "./EMailMethod.svelte"
    import PhoneMethod from "./PhoneMethod.svelte"
    import SmsMethod from "./SmsMethod.svelte"
    import SiteMethod from "./SiteMethod.svelte"
    import {slide} from "svelte/transition"
    import MethodButton from "./MethodButton.svelte"

    export let values
    export let methods

    let current = null

    const methodComponents = {
        "E-MAIL": EMailMethod,
        "PHONE" : PhoneMethod,
        "PHONE_AUTO" : PhoneMethod,
        "SMS" : SmsMethod,
        "SITE" : SiteMethod,
    }

    function setMethod(method) {
        current = method
    }
</script>

<div class="centered spacy-below flex" transition:slide>
    <div class="spacy-below large important center-text"> Для отправки вручную выберите один из следующих способов: </div>

    <div class="spacy-below flex buttons">
        {#each methods as method}
            <MethodButton type={method.type} on:click={() => setMethod(method)}/>
        {/each}
    </div>

    {#if current !== null}
        <svelte:component this={methodComponents[current.type]} {values} method={current}/>
    {/if}
</div>

<style>
    div.buttons {
        flex-direction : row;
        column-gap: 20px;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
