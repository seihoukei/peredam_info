<script>
    import EMailMethod from "./methods/EMailMethod.svelte"
    import PhoneMethod from "./methods/PhoneMethod.svelte"
    import SmsMethod from "./methods/SmsMethod.svelte"
    import SiteMethod from "./methods/SiteMethod.svelte"
    import {slide} from "svelte/transition"
    import MethodButton from "./MethodButton.svelte"

    export let system
    export let input
    export let methods

    let current = null

    $: values = {
        ...system.values,
        ...input,
    }

    const methodComponents = {
        "E-MAIL": EMailMethod,
        "PHONE" : PhoneMethod,
        "PHONE_AUTO" : PhoneMethod,
        "SMS" : SmsMethod,
        "SITE" : SiteMethod,
    }

    const setMethod = (method) => {
        current = method
    }
</script>

<div class="submit" transition:slide>
    Выберите способ:

    <div class="buttons">
        {#each methods as method}
            <MethodButton type={method.type} on:click={setMethod(method)}/>
        {/each}
    </div>

    {#if current !== null}
        <svelte:component this={methodComponents[current.type]} {values} method={current}/>
        <button on:click>Завершить</button>
    {/if}
</div>

<style>
    div.buttons {
        display : flex;
        flex-direction : row;
        column-gap: var(--2u);
        flex-wrap: wrap;
        justify-content: center;
    }

    div.submit {
        display : flex;
        flex-direction : column;
        align-items: center;
        margin: 0 0 var(--2u);
    }

    button {
        margin: var(--2u) 0 0;
    }
</style>
