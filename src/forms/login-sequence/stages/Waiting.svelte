<script>
    import { fade } from "svelte/transition"
    export let message
</script>

<div class="central spaced flex" transition:fade>
    Ожидание: {message}
</div>
