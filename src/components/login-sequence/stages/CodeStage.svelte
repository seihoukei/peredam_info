<script>
    import SetCode from "components/login-sequence/stages/code/SetCode.svelte"
    import RequestCode from "components/login-sequence/stages/code/RequestCode.svelte"

    import modal from "stores/modal.js"

    import Tokens from "utility/tokens.js"

    export let state

    let code = ""

    $: tokens = state.tokens
    $: login = state.login
    $: setting = tokens.current !== ""
    $: stage = state.stage

    function setCode() {
        if (code === "") {
            tokens.open = tokens.current
            tokens.encrypted = ""
            state.stage = "complete"

        } else {
            const result = Tokens.encrypt(tokens.current, code)

            if (result.success) {
                tokens.encrypted = result.data
                tokens.open = ""
                state.stage = "complete"

            } else {
                modal.error("Ошибка шифрования")
            }
        }
    }

    function checkCode() {
        const result = Tokens.decrypt(tokens.encrypted, code)

        if (result.success) {
            tokens.current = result.data
            state.stage = "complete"

        } else {
            modal.error("Неправильный код")
            code = ""
        }
    }

    function back() {
        state.stage = "password"
    }
</script>

{#if stage === "code"}
    {#if setting}
        <SetCode {login} bind:code on:submit={setCode}/>

    {:else}
        <RequestCode {login} bind:code on:cancel={back} on:submit={checkCode}/>

    {/if}
{/if}
