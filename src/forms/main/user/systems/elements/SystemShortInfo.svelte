<script>
    import {slide} from "svelte/transition"
    import library from "../../../../../stores/library.js"

    export let system = {}

    $: provider = $library.providers[system.provider] ?? null

</script>

{#if provider !== null}
<div transition:slide>
    <button on:click> {system.name || `${provider.type}`}</button>
<!--    <span class="next">Передать с {system.next.from} по {system.next.to}</span>-->
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
