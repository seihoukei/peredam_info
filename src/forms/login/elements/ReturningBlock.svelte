<script>
    import {fly} from 'svelte/transition';
    import {loginFlyRight} from "../../../utility/transitions.js"
    import tokens from "../../../stores/tokens.js"
    import Api from "../../../utility/api.js"
    import StatusDisplay from "./StatusDisplay.svelte"
    import {success} from "../../../utility/messages.js"

    export let login
    export let password
    export let isValid

    let waiting = false
    $: canLogIn = isValid && !waiting

    let identification = success("")

    const submit = async () => {
        waiting = true
        identification = Api.logIn(login, password)
        const result = await identification
        if (result.success)
            tokens.setNew(result.data.token)
        else
            waiting = false
    }

</script>

<button transition:fly={loginFlyRight} on:outroend disabled={!canLogIn} on:click={submit}>Войти</button>
{#await identification}
    <StatusDisplay>...попытка входа...</StatusDisplay>
{:then status}
    {#if !status.success}
        <StatusDisplay status="error"}>{status.data}</StatusDisplay>
    {/if}
{/await}
