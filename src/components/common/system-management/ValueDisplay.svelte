<script>
    import {slide} from "svelte/transition"

    export let name = ""
    export let value = ""
</script>

<div class="centered flex" transition:slide>
    <span class="center-text">{name}</span>
    <span class="center-text large spacy-below">{value}</span>
</div>
