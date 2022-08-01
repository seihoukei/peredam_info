<script>
    import appState from "stores/app-state.js"
    import modal from "stores/modal.js"

    import Tokens from "utility/tokens.js"

    function confirmLogout() {
        modal.notify(
            `Выйти из аккаунта ${$appState.username}?`, [{
                text: "Да",
                callback: logout,
            }, {
                text: "Нет",
                callback: null,
            }],
        )
    }

    function logout() {
        Tokens.clear()
        appState.reset()
    }

</script>

<button on:click={confirmLogout}>
    Сменить пользователя
</button>
