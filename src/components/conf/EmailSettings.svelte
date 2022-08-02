<script>
    import {slide} from "svelte/transition"
    import modal from "stores/modal.js"
    import appState from "stores/app-state.js"
    import Api from "utility/api.js"
    import {onMount} from "svelte"

    export let emailProperties = {
    }

    let newAddress = emailProperties.address ?? ""
    let code = ""
    let updateTimeout = null
    let remembered = null

    $: isAddressInvalid = newAddress && (!newAddress.match(/.+@.+/) || newAddress === emailProperties.address)
    $: isExpectingConfirmation = emailProperties.address !== "" && !emailProperties.confirmed

    $: extraSettings = {
        email_reminders: emailProperties.reminders ?? false,
        email_send_copy: emailProperties.sendCopy ?? false,
    }

    onMount(() => {
        rememberSettings(extraSettings)
        if (updateTimeout)
            clearTimeout(updateTimeout)
    })

    $: setEmailSettings(extraSettings)

    async function setNewAddress() {
        if (isAddressInvalid)
            return

        const result = await modal.await(
            Api.setEmail($appState.token, newAddress),
            "Установка нового адреса и отправка кода подтверждения..."
        )

        if (result.success) {
            modal.success("Код подтверждения выслан")
            emailProperties.address = newAddress
            emailProperties.confirmed = false

        } else {
            modal.error(result.error)

        }
    }

    function unsubscribe() {
        newAddress = ""
        setNewAddress()
    }

    async function checkConfirmationCode() {
        const result = await modal.await(
            Api.confirmEmail($appState.token, code),
            "Проверка кода..."
        )

        if (result.success) {
            modal.success("Адрес успешно подтвержден")
            emailProperties.confirmed = true
            newAddress = emailProperties.address

        } else {
            modal.error(result.error)

        }
    }

    function rememberSettings(settings) {
        remembered = JSON.stringify(settings)
    }

    async function setEmailSettings() {
        if (emailProperties.address === "" || !emailProperties.confirmed)
            return

        if (updateTimeout)
            clearTimeout(updateTimeout)

        if (JSON.stringify(extraSettings) === remembered)
            return

        updateTimeout = setTimeout(async () => {
            clearTimeout(updateTimeout)

            const result = await modal.await(
                Api.setEmailSettings($appState.token, extraSettings),
                "Установка настроек уведомлений...",
                true
            )

            if (result.success) {
                modal.success("Уведомления успешно установлены")
                rememberSettings(result.data)

            } else {
                modal.error(result.error)

            }
        }, 1000)
    }


</script>

<div class="centered limited flex">
    <div class="centered spacy-below flex">
        <form on:submit|preventDefault={setNewAddress}>
            <div class="centered center-text flex">
                E-mail для оповещений:
                <input class="spacy-below large"
                       type="email"
                       placeholder={emailProperties.address}
                       bind:value={newAddress}>

                {#if emailProperties.address !== newAddress && newAddress !== ""}
                    <input type="submit"
                           disabled={isAddressInvalid}
                           transition:slide
                           value="Установить новый адрес">

                {:else if emailProperties.address !== "" && (emailProperties.confirmed || newAddress === "") }
                    <button transition:slide
                            on:click={unsubscribe}>
                        Отписаться
                    </button>

                {/if}
            </div>
        </form>

        {#if isExpectingConfirmation}
            <form on:submit|preventDefault={checkConfirmationCode}>
                <div class="centered important center-text spacy-below flex" transition:slide>
                    На ваш адрес было выслано письмо с кодом подтверждения.
                    <br>
                    Введите полученный код и нажмите кнопку "Подтвердить".
                </div>

                <div class="centered nowrap flex" transition:slide>
                    Код подтверждения адреса {emailProperties.address}:

                    <input class="spacy-below large"
                           type="number"
                           bind:value={code}>

                    <input type="submit"
                           value="Подтвердить">

                </div>
            </form>

        {/if}
    </div>

    {#if emailProperties.address !== "" && emailProperties.confirmed}
        <div class="centered spaced spacy-below flex" transition:slide>
            <label>
                <input type="checkbox"
                       bind:checked={emailProperties.reminders}>
                Получать напоминания о наступившем сроке передачи показаний на электронную почту
            </label>

            <label>
                <input type="checkbox"
                       bind:checked={emailProperties.sendCopy}>

                Дублировать информацию о переданных показаниях на электронную почту
            </label>

        </div>
    {/if}


</div>
