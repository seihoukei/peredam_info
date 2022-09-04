<script>
    import apiStatus from "stores/api-status.js"
    import Api from "utility/api.js"
    import appState from "stores/app-state.js"

    export let userSettings = {}

    const MAX_NAME_LENGTH = 64

    let displayName = userSettings.display_name
    $: isNameInvalid = displayName.length === 0 || displayName.length > MAX_NAME_LENGTH

    async function setNewDisplayName() {
        const result = await apiStatus.await(
            Api.setDisplayName($appState.token, displayName),
            "Установка нового имени..."
        )

        if (result.success) {
            apiStatus.success("Отображаемое имя изменено")
            userSettings.display_name = result.data.display_name
            appState.setValue("display_name", result.data.display_name, appState.UPDATE_ADDRESS.NO)

        } else {
            apiStatus.error(result.error)

        }
    }
</script>

<div class="centered flex">
    <div class="centered spacy-below flex">
        <form on:submit|preventDefault={setNewDisplayName}>
            <div class="centered center-text flex">
                Отображаемое имя:
                <input class="spacy-below large"
                       placeholder="Отображаемое имя"
                       bind:value={displayName}>

                <input type="submit"
                       disabled={isNameInvalid}
                       value="Установить новое имя">
            </div>
        </form>
    </div>
</div>
