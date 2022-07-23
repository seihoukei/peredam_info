<script>
    import LoginPrompt from "./login-sequence/LoginPrompt.svelte"
    import RequestPhone from "./login-sequence/stages/RequestPhone.svelte"

    let login = ""
    let password = ""
    let confirmPassword = ""
    let code = ""
    let confirmCode = ""

    const STAGES = {
        NONE : -1,
        REQUEST_PHONE : 0,
        REQUEST_USERNAME : 1,
        CONFIRM_NEW_USER : 9,
        SET_NEW_PASSWORD : 2,
        CONFIRM_NEW_PASSWORD : 3,
        REQUEST_OLD_PASSWORD : 4,
        SET_CODE : 5,
        CONFIRM_CODE : 6,
        REQUEST_CODE : 7,
        COMPLETE : 8,
    }

    let stage = STAGES.REQUEST_PHONE
</script>

{#if stage === STAGES.REQUEST_PHONE}
    <RequestPhone bind:phone={login} />
{:else if stage === STAGES.REQUEST_USERNAME}
{:else if stage === STAGES.CONFIRM_NEW_USER}

{:else if stage === STAGES.SET_NEW_PASSWORD}
{:else if stage === STAGES.CONFIRM_NEW_PASSWORD}
{:else if stage === STAGES.REQUEST_OLD_PASSWORD}

{:else if stage === STAGES.SET_CODE}
{:else if stage === STAGES.CONFIRM_CODE}
{:else if stage === STAGES.REQUEST_CODE}

{:else if stage === STAGES.COMPLETE}
{/if}

<style>

</style>
