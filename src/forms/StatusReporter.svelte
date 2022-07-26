<script>
    import status from "../stores/status.js"

</script>

{#if $status.waiting || $status.error}
    <div class="fullscreen centered flex">
        <div class="opaque centered spaced flex status" >
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

<style>
    div.fullscreen {
        background-color: #00000088;
        position: absolute;
        left :0;
        top : 0;
        width : 100vw;
        height : 100vh;

        justify-content: center;
    }

    div.status {
        min-width : 300px;
        min-height : 200px;
        padding : 20px;
        justify-content: space-around;
    }
</style>
