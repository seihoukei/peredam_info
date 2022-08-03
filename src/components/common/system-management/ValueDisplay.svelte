<script>
    import {slide} from "svelte/transition"

    export let name = ""
    export let value = ""
</script>

<div class="centered row-flex spacy-below" transition:slide>
    <span class="">{name}</span>
    <span class="center-text large">{value}</span>
</div>
