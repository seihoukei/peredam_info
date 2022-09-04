<script>
    import apiStatus from "stores/api-status.js"
    import Api from "utility/api.js"
    import appState from "stores/app-state.js"
    import modal from "stores/modal.js"
    import SideAuth from "utility/side-auth.js"

    export let userSettings = {}

    $: vk_id = userSettings.vk_id

    async function disconnect() {

        const result = await apiStatus.await(
            Api.setVKAccount($appState.token, 0),
            "Отключение учетной записи ВК..."
        )

        if (result.success) {
            apiStatus.success("Учетная запись ВК отключена.")
            userSettings.vk_id = null

        } else {
            apiStatus.error(result.error)

        }
    }

    function confirmDisconnect() {
        modal.notify(
            `Вы уверены, что хотите отвязать аккаунт VK и знаете, как войти в систему другим способом? `, [{
                text: "Да",
                keyCodes: [13,32],
                callback: disconnect,
            }, {
                text: "Нет",
                keyCodes: [27],
                back : true,
                callback: null,
            }],
        )
    }

    async function connect(vk_id) {
        const result = await apiStatus.await(
            Api.setVKAccount($appState.token, vk_id),
            `Подключение учетной записи ВК №${vk_id}...`
        )

        if (result.success) {
            apiStatus.success("Учетная запись ВК подключена.")
            userSettings.vk_id = vk_id

        } else {
            apiStatus.error(result.error)

        }

    }

    async function messageListener(event) {
        if (event.data?.type === "attach_user") {
            console.log(event.data)
            connect(event.data.user_id ?? 0)
            window.removeEventListener("message", messageListener)
        }
    }

    async function getVkId() {
        window.addEventListener("message", messageListener)

        const params = `scrollbars=no,resizable=no,status=no,location=yes,toolbar=no,menubar=no`;

        const authWindow = await window.open(SideAuth.getVkAttachUrl(), "Подключение аккаунта ВК", params)
        authWindow.onclose = () => window.removeEventListener("message", messageListener)
    }
</script>

<div class="centered flex">
    <div class="centered center-text spacy-below flex">
        {#if vk_id}
            <span>У вас подключена учетная запись ВКонтакте <a href="https://vk.com/id{vk_id}" target="_blank">№{vk_id}</a>.<br> Вы можете использовать её для быстрого входа.</span>
            <button on:click={confirmDisconnect}>Отключить</button>
        {:else}
            <span>Вы можете подключить учетную запись ВКонтакте для быстрого входа в систему.</span>
            <button on:click={getVkId}>Подключить</button>
        {/if}
    </div>
</div>
