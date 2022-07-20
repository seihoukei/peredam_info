<script>
    export let system = {}
    import {slide} from "svelte/transition"
</script>

<pre transition:slide>
Просмотр системы
{JSON.stringify(system, null, 1)}
</pre>
