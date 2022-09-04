<script>
    import appState from "stores/app-state.js"
    import DisplayName from "components/conf/user/DisplayName.svelte"
    import VKConnection from "components/conf/user/VKConnection.svelte"

    export let userProperties

    function back() {
        appState.setPage("")
    }
</script>

{#if import.meta.env.MODE === "development"}
    <pre class="bottom left debug">{JSON.stringify(userProperties, null, 1)}</pre>
{/if}

<div class="spaced centered limited flex">
    <DisplayName userSettings={userProperties.user}/>
    <VKConnection userSettings={userProperties.user} />

    <div class="row-flex spacy-below">
        <button on:click={back}>◀ Назад</button>
    </div>
</div>
