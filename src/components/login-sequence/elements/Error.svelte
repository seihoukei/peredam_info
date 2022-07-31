<script>
    import {fade} from "svelte/transition"
    import {createEventDispatcher} from "svelte"

    export let message = "Неизвестная ошибка"

    const dispatch = createEventDispatcher()

    function checkKey({keyCode}) {
        if (keyCode === 13 || keyCode === 27 || keyCode === 32) {
            dispatch("click")
        }
    }

</script>

<svelte:window on:keydown={checkKey}/>

<div class="central spaced flex" transition:fade>
    Ошибка: {message}
    <button on:click>Попробовать ещё раз</button>
</div>
