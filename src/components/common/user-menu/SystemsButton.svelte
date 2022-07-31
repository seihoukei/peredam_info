<script>
    import appState from "../../../stores/app-state.js"

    function setUser() {
        appState.setPage("user")
    }

</script>

{#if $appState.token !== "" && $appState.page !== "user"}
    <button on:click={setUser}>Системы</button>
{/if}
