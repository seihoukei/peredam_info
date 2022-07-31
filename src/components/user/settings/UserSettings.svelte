<script>
    import EmailSettings from "./EmailSettings.svelte"
    import PushSettings from "./PushSettings.svelte"
    import appState from "../../../stores/app-state.js"
    import {slide} from "svelte/transition"

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
