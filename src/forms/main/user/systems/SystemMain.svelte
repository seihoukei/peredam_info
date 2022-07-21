<script>
    import library from "../../../../stores/library.js"
    import {slide} from "svelte/transition"

    export let system = {}

    $: provider = $library.providers[system.provider] ?? null
</script>

<pre transition:slide>
Просмотр системы
{JSON.stringify(system, null, 1)}
</pre>
