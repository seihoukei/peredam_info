<script>
    import {createEventDispatcher} from "svelte"

    export let provider
    export let values

    const dispatch = createEventDispatcher()

    const back = () => {
        provider = null
    }

    const finish = () => {
        dispatch("finish")
    }
</script>

<button on:click={back}>Назад</button>
<button on:click={finish}>Готово</button>
