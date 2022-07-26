<script>
    import status from "../../stores/status.js"
    import {fade} from "svelte/transition"
    import {fastFade} from "../../utility/transitions.js"

</script>

{#if $status.waiting || $status.error}
    <div class="fullscreen-container" transition:fade={fastFade}>
        <div class="dialog" >
            {#if $status.error}
                <span class="large">Ошибка</span>
                <span>{$status.errorMessage}</span>
                <button on:click={() => status.recover()}>Очень жаль</button>
            {:else}
                <span class="large">Ожидание</span>
                <span>{$status.waitingMessage}</span>
            {/if}
        </div>
    </div>
{/if}
