<script>
    import {slide} from "svelte/transition"
    import library from "../../../stores/library.js"
    import Period from "../../../utility/period.js"

    export let system
    export let current = false

    $: provider = system ? library.providers[system.provider_id] ?? null : null
    $: displayName = `${current ? "◀" : ""} ${provider.type} (${system?.values?.ACCOUNT ?? ""})`
    $: period = new Period(provider?.period)
    $: nextTime = period.nextString(system?.last?.date)
</script>

{#if provider !== null}
    <div class="centered flex spacy-below" transition:slide>
        <button class="large" on:click>{displayName}</button>
        <span class="next spacy-below">Передать {nextTime}</span>
    </div>
{/if}
