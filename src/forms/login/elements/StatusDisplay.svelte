<script>
    export let status=""
</script>

<span class={status}><slot></slot></span>

<style>
    span {
        margin: calc(var(--2u) * -1) 0 0 0;
        font-size: var(--small-font-size);
        text-align: center;
    }

    span.error {
        color : var(--status-error-color);
    }

    span.ok {
        color : var(--status-ok-color);
    }
</style>
