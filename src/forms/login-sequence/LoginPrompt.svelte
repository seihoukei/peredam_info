<script>
    import {slide} from "svelte/transition"

    export let type
    export let value
</script>

<div class="main" transition:slide>
    <span class="prompt"><slot /></span>
    <div class="input">
        {#if type === "tel"}
            <input type="tel" bind:value />
        {:else if type === "number"}
            <input type="number" bind:value />
        {:else}
            <input bind:value />
        {/if}
        <button class="submit">&gt;</button>
    </div>
</div>

<style>
    input {
        border-radius: 20px 0 0 20px;
    }

    button.submit {
        border-radius: 0 20px 20px 0;
    }
</style>
