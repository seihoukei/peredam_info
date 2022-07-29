<script>
    export let visible = false

    function hide() {
        visible = false
    }
</script>

{#if visible}
    <div class="opaque top-central flex">
        Ведите себя хорошо.
        <button on:click={hide}>Закрыть</button>
    </div>
{/if}
