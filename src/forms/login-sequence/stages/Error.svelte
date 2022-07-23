<script>
    import { fade } from "svelte/transition"

    export let message
</script>

<div class="central spaced flex" transition:fade>
    Ошибка: {message}
    <button on:click>Попробовать ещё раз</button>
</div>
