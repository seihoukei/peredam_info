<script>
    import reading from "../../stores/reading.js"
    import {fade} from "svelte/transition"
    import Transitions from "../../utility/transitions.js"

    function close() {
        reading.set(false)
    }
</script>

{#if $reading}
    <div class="fullscreen-container" transition:fade={Transitions>fastFade}>
        <div class="dialog">
            Здесь будет информация о программе и передаче показаний.
            <button on:click={close}>Закрыть</button>
        </div>
    </div>
{/if}
