<script>
    import {slide} from "svelte/transition"

    export let name = ""
    export let value = ""
    export let type = "ANY"
</script>

<div class="detail" transition:slide>
    <span class="name">{name}</span>
    <input bind:value placeholder={type}/>
</div>

<style>
    div.detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin : 0 0 var(--2u);
    }
    span {
        text-align: center;
    }
    span.name {
         font-size: var(--2u);
         text-align: center;
    }
    span.value {
        font-size: var(--2_5u);
        margin : 0 0 var(--2u);
    }
</style>
