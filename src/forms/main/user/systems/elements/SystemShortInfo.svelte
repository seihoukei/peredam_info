<script>
    export let system = {
        name : "",
        id : -1,
        next : {
            from: "никогда",
            to: "никогда",
        }
    }
</script>
<div>
    <button on:click> {system.name}</button>
    <span class="next">Передать с {system.next.from} по {system.next.to}</span>
</div>

<style>
    div {
        display : flex;
        flex-direction: column;
        align-items: center;
        padding : 0 0 var(--3u);
    }

    span {
        font-size: var(--2u);
    }
</style>
