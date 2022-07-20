<script>
    import SetCode from "./login/SetCode.svelte"
    import LoginWithCode from "./login/LoginWithCode.svelte"
    import LoginWithPassword from "./login/LoginWithPassword.svelte"
    import {checkingCode, loggedIn, settingCode} from "../stores/tokens.js"

</script>

{#if !$loggedIn}
<!--
    $loggedIn can't be truthy, as this component is only added
    when it's falsy, but this {#if} block prevents transition leaks
-->
    {#if $settingCode}
        <SetCode/>
    {:else if $checkingCode}
        <LoginWithCode/>
    {:else}
        <LoginWithPassword/>
    {/if}
{/if}
