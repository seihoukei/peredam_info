<script>
    import tokens from "../../../../stores/tokens.js"

    const logout = () => {
        tokens.reset("current")
        tokens.reset("open")
        tokens.reset("encrypted")
    }
</script>

<button on:click={logout}>Выйти</button>
