<script>
    import appState from "stores/app-state.js"

    import Tokens from "utility/tokens.js"
    import modal from "stores/modal.js"

    function confirmLogout() {
        modal.notify(
            `Выйти из аккаунта ${$appState.display_name}?`, [{
                text: "Да",
                keyCodes: [13,32],
                callback: logout,
            }, {
                text: "Нет",
                keyCodes: [27],
                back : true,
                callback: null,
            }],
        )
    }

    function logout() {
        Tokens.clear()
        delete localStorage.login
        delete localStorage.displayName
        delete localStorage.authVer
        appState.reset()
    }

</script>

<button on:click={confirmLogout}>
    Сменить пользователя
</button>
