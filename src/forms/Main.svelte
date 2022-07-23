<script>
    import Tokens from "../utility/tokens.js"

    export let username
    export let token

    function logOut() {
        Tokens.clear()
        token = ""
    }
</script>

<div class="spaced centered top-central flex">
Main {username}
<button on:click={logOut}>Выйти</button>
</div>
