<script>
    import SetCode from "components/login-sequence/stages/code/SetCode.svelte"
    import RequestCode from "components/login-sequence/stages/code/RequestCode.svelte"

    import apiStatus from "stores/api-status.js"

    import Tokens from "utility/tokens.js"

    export let state

    let code = ""

    $: tokens = state.tokens
    $: login = state.login
    $: display_name = login.replace("phone:", "📞")
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
                apiStatus.error("Ошибка шифрования")
            }
        }
    }

    function checkCode() {
        const result = Tokens.decrypt(tokens.encrypted, code)

        if (result.success) {
            tokens.current = result.data
            state.stage = "complete"

        } else {
            apiStatus.error("Неправильный код")
            code = ""
        }
    }

    function back() {
        state.stage = "password"
    }
</script>

{#if stage === "code"}
    {#if setting}
        <SetCode {display_name} bind:code on:submit={setCode}/>

    {:else}
        <RequestCode {display_name} bind:code on:cancel={back} on:submit={checkCode}/>

    {/if}
{/if}
