<script>
    import tokens from "../../../stores/tokens.js"

    const setCode = () => {
        tokens.assign("new", "current")
        tokens.reset("current")
    }
</script>

{#if $tokens.open}
    <button on:click={setCode}>Установить код</button>
{:else if $tokens.encrypted}
    <button on:click={setCode}>Изменить код</button>
{/if}
