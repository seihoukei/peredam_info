<script>
    import Tokens from "../../../utility/tokens.js"
    import token from "../../../stores/token.js"
    import Address from "../../../utility/address.js"

    function logOut() {
        Tokens.clear()
        token.set("")
        Address.set()
    }

</script>

<button on:click={logOut}>Выйти</button>
