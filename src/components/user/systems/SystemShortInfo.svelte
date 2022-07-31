<script>
    import {slide} from "svelte/transition"
    import library from "../../../stores/library.js"
    import Period from "../../../utility/period.js"
    import appState from "../../../stores/app-state.js"

    export let system = {}

    $: system_id = $appState.system_id
    $: current = (system_id === +system.id)

    $: provider = system ? library.providers[system.provider_id] ?? null : null
    $: displayName = `${current ? "◀" : ""} ${provider?.type} (${system?.values?.ACCOUNT ?? ""})`
    $: period = new Period(provider?.period)
    $: nextTime = period.nextString(system?.last?.date)

    function switchCurrent() {
        if (current) {
            appState.setSystemId(null)
        } else {
            appState.setSystemId(+system.id)
        }
    }
</script>

{#if provider !== null}
    <div class="centered flex" transition:slide>
        <button class="large" on:click={switchCurrent}>{displayName}</button>
        <span class="next spacy-below">Передать {nextTime}</span>
    </div>
{/if}
