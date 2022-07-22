<script>
    import {slide} from "svelte/transition"
    import library from "../../../../../stores/library.js"
    import Period from "../../../../../utility/period.js"

    export let system

    $: provider = system ? library.providers[system.provider] ?? null : null
    $: displayName = system.name || `${provider.type}`
    $: period = new Period(provider?.period)
    $: nextTime = period.nextString(system?.last?.date)
</script>

{#if provider !== null}
    <div transition:slide>
        <button on:click> {displayName}</button>
        <span class="next">Передать {nextTime}</span>
    </div>
{/if}

<style>
    div {
        display : flex;
        flex-direction: column;
        align-items: center;
        padding : 0 0 var(--3u);
    }

    span {
        font-size: var(--2u);
    }
</style>
