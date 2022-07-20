<script>
    export let system = {}

    const back = () => {
        system = null
    }
</script>

<pre>
Просмотр системы
{JSON.stringify(system, null, 1)}
</pre>
<button on:click={back}>Назад</button>
