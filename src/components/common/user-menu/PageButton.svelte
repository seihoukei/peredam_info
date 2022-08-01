<script>
    import {slide} from "svelte/transition"

    import appState from "stores/app-state.js"

    export let page = ""

    $: currentPage = $appState.page

    function setPage() {
        appState.setPage(page)
    }

</script>

{#if page !== currentPage}
    <button on:click={setPage} transition:slide|local>
        <slot/>
    </button>
{/if}
