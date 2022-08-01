<script>
    import appState from "stores/app-state.js"

    export let loginState = null

    function help() {
        if (loginState) {
            appState.setHelpPage(`login/${
                loginState.stage
            }${
                loginState.isNewUser && loginState.stage !== `code` ? `/new` : ``
            }${
                loginState.tokens.current ? `/set` : ``
            }`)
        } else {
            appState.setHelpPage(`${
                $appState.page
            }${
                $appState.system_id ? "/sys" :
                $appState.provider_id ? "/prov" :
                $appState.city_id ? "/city" :
                ""
            }${
                $appState.mode ? `/${$appState.mode}` : ""
            }`)
        }
    }

</script>

<div class="relative">
    <img alt="logo"
         class="logo"
         src="/resources/images/top.png">

    <button on:click={help}
            class="info">?</button>
</div>

<style>
    img.logo {
        padding: 30px 0 20px;
        height: 70px;
    }

    button.info {
        position: absolute;
        top: 40px;
        right: -60px;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        font: 35px bold;
    }
</style>
