<script>
    import apiStatus from "stores/api-status.js"
    import {slide} from "svelte/transition"

    $: status = $apiStatus.status
    $: message = $apiStatus.message

</script>

{#if status === 'waiting'}
    <div class="status" transition:slide|local>
        <span class="waiting">...</span> {message}
    </div>
{:else if status === 'success'}
    <div class="status" transition:slide|local>
        <span class="success">✓</span> {message}
    </div>
{:else if status === 'error'}
    <div class="status" transition:slide|local>
        <span class="error">✘</span> {message}
    </div>
{/if}

<style>
    div.status {
        position: absolute;
        top: 0;
        width : 100vw;
        height : 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000000AA;
    }

    span.waiting {
        color: var(--important-color);
    }

    span.success {
        color: var(--status-ok-color);
    }

    span.error {
        color: var(--status-error-color);
    }
</style>
