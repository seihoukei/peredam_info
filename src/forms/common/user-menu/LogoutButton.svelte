<script>
    import Tokens from "../../../utility/tokens.js"
    import token from "../../../stores/token.js"

    function logOut() {
        Tokens.clear()
        token.set("")
    }

</script>

<button on:click={logOut}>Выйти</button>
