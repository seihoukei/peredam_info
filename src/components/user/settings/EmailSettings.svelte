<script>
    import {slide} from "svelte/transition"

    let email = ""
    let state = ""
    let newMail = ""
    let correctCode = "1234"
    let code = ""

    $: invalid = !newMail.match(/.+@.+/)

    function subscribe() {
        email = newMail
        state = "sent"
    }

    function unsubscribe() {
        email = ""
        state = ""
    }

    function confirm() {
        if (code === correctCode) {
            state = "confirmed"
        }
    }


</script>

<div class="centered flex">
    E-mail для оповещений:
    <input class="large"
           type="email"
           bind:value={newMail}>

    {#if state !== "confirmed"}
        <button on:click={subscribe}
                disabled={invalid}
                transition:slide>Подписаться</button>

        {#if state === "sent"}
            <div class="centered flex" transition:slide>
                Код подтверджения адреса {email}

                <input class="large"
                       type="text"
                       bind:value={code}>

                <button on:click={confirm}>Подтвердить</button>

            </div>

        {/if}

    {:else}
        <button on:click={unsubscribe} transition:slide>Отписаться</button>

    {/if}

</div>
