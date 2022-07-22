<script>
    import {slide} from "svelte/transition"

    export let name = ""
    export let value = ""
    export let type = "ANY"
    export let old = ""

    $: inputType = type.split(":")[0]
</script>

<div class="detail" transition:slide>
    <span class="name">{name}</span>
    {#if inputType === "NUM"}
        <input type="number" bind:value placeholder={old} />
    {:else}
        <input type="text" bind:value placeholder={old} />
    {/if}
</div>

<style>
    div.detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin : 0 0 var(--2u);
    }
    span {
        text-align: center;
    }
    span.name {
         font-size: var(--2u);
         text-align: center;
    }
</style>
