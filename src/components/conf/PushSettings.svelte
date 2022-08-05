<script>
    import {slide} from "svelte/transition"
    import Api from "utility/api.js"
    import appState from "stores/app-state.js"

    const supported = ("serviceWorker" in navigator) && ("PushManager" in window)

    let existing_subscription = getSubscription()

    async function getSubscription(awaitFunction) {
        if (awaitFunction)
            await awaitFunction
        const serviceWorkerRegistration = await navigator.serviceWorker.ready
        return serviceWorkerRegistration.pushManager.getSubscription()
    }

    async function registerPushSubscription() {
        const options = {
            userVisibleOnly: true,
            applicationServerKey: Api.publicPushKey,
        }

        const serviceWorkerRegistration = await navigator.serviceWorker.ready

        try {
            const subscription = serviceWorkerRegistration.pushManager.subscribe(options)
            existing_subscription = getSubscription(subscription)
            Api.registerPushSubscription($appState.token, await subscription)
        } catch (e) {
            console.log(e)
            existing_subscription = getSubscription()
        }
    }

    async function unsubscribe() {
        const subscription = await existing_subscription
        Api.unregisterPushSubscription($appState.token, subscription)
        existing_subscription = getSubscription(subscription.unsubscribe())
    }
</script>

<div class="centered flex">
    <div class="center-text">Состояние Push-уведомлений на этом устройтве:</div>

    {#if supported}
        {#await existing_subscription}
            <div class="spacy-below center-text" transition:slide|local>Проверка...</div>

        {:then result}
            <div transition:slide|local>
                {#if result}
                    <div class="spaced spacy-below centered flex">
                        <div class="center-text">Push-уведомления подключены.</div>
                        <button on:click={unsubscribe}>
                            Отключить Push-уведомления
                        </button>
                    </div>

                {:else}
                    <div class="spaced spacy-below centered flex">
                        <div class="center-text" transition:slide|local>Push-уведомления отключены.</div>
                        <button on:click={registerPushSubscription}>
                            Подключить Push-уведомления
                        </button>
                    </div>

                {/if}

            </div>

        {/await}

    {:else}
        Не поддерживаются
    {/if}
</div>
