<script>
    import Tokens from "../../../utility/tokens.js"
    import appState from "../../../stores/app-state.js"

    function logOut() {
        Tokens.clear()
        appState.reset()
    }

</script>

<button on:click={logOut}>Выйти</button>
