<script>
    import EmailSettings from "components/conf/notifications/EmailSettings.svelte"
    import PushSettings from "components/conf/notifications/PushSettings.svelte"

    import appState from "stores/app-state.js"

    export let userProperties

    function back() {
        appState.setPage("")
    }
</script>

{#if import.meta.env.MODE === "development"}
    <pre class="bottom left debug">{JSON.stringify(userProperties, null, 1)}</pre>
{/if}

<div class="spaced centered limited flex">
    <EmailSettings bind:emailProperties={userProperties.email} />
    <PushSettings/>

    <div class="row-flex spacy-below">
        <button on:click={back}>◀ Назад</button>
    </div>
</div>
