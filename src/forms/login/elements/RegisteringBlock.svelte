<script>
    import {fly} from 'svelte/transition';
    import {loginFlyLeft} from "../../../utility/transitions.js"
    import tokens from "../../../stores/tokens.js"
    import Api from "../../../utility/api.js"
    import StatusDisplay from "./StatusDisplay.svelte"
    import {success} from "../../../utility/messages.js"

    export let login
    export let password
    export let isValid

    let hasAgreed = false
    let waiting = false
    $: canRegister = isValid && hasAgreed && !waiting

    let registration = success("")

    const submit = async () => {
        waiting = true
        registration = Api.register(login, password)
        const result = await registration
        if (result.success)
            tokens.setNew(result.data.token)
        else
            waiting = false
    }

</script>

<label transition:fly={loginFlyLeft} on:outroend>
    <input type="checkbox" bind:checked={hasAgreed}> Буду себя хорошо вести
</label>

{#if hasAgreed}
    <button transition:fly={loginFlyLeft} disabled={!canRegister || waiting} on:click={submit}>Зарегистрироваться</button>
    {#await registration}
        <StatusDisplay>...попытка регистрации...</StatusDisplay>
    {:then status}
        {#if !status.success}
            <StatusDisplay status="error"}>{status.data}</StatusDisplay>
        {/if}
    {/await}
{/if}
