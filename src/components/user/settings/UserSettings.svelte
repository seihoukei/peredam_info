<script>
    import EmailSettings from "components/user/settings/EmailSettings.svelte"
    import PushSettings from "components/user/settings/PushSettings.svelte"

    import {slide} from "svelte/transition"

    import appState from "stores/app-state.js"

    function back() {
        appState.setPage("")
    }
</script>

<div class="spaced centered flex" transition:slide>
    <EmailSettings/>
    <PushSettings/>

    <div class="row-flex spacy-below">
        <button on:click={back}>◀ Назад</button>
    </div>
</div>
