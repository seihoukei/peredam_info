<script>
    import Tokens from "../../../utility/tokens.js"
    import appState from "../../../stores/app-state.js"
    import modal from "../../../stores/modal.js"

    function logOut() {
        modal.notify(
            `Выйти из аккаунта ${$appState.username}?`,
            [
                {
                    text: "Да",
                    callback: () => {
                        Tokens.clear()
                        appState.reset()
                    },
                }, {
                text: "Нет",
                callback: null,
            },
            ],
        )
    }

</script>

<button on:click={logOut}>Сменить пользователя</button>
