<script>
    import appState from "stores/app-state.js"

    function help() {
        appState.setHelpPage(`${
            $appState.page
        }${
            $appState.system_id !== null ? "/sys" :
            $appState.provider_id !== null ? "/prov" :
            $appState.city_id !== null ? "/city" :
            ""
        }${
            $appState.mode ? `/${$appState.mode}` : ""
        }`)
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
        padding: 30px 0;
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
