<script>
    import EmailSettings from "components/conf/EmailSettings.svelte"
    import PushSettings from "components/conf/PushSettings.svelte"

    import {slide} from "svelte/transition"

    import appState from "stores/app-state"

    export let userProperties

    $: page = $appState.page

    function back() {
        appState.setPage("")
    }
</script>

{#if import.meta.env.MODE === "development"}
    <pre class="bottom left debug">{JSON.stringify(userProperties, null, 1)}</pre>
{/if}

{#if page === "conf"}
    <div class="spaced centered flex" transition:slide>
        <EmailSettings bind:emailProperties={userProperties.email} />
        <PushSettings/>

        <div class="row-flex spacy-below">
            <button on:click={back}>◀ Назад</button>
        </div>
    </div>
{/if}
